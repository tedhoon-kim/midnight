-- =====================================================
-- 조회수 기능 마이그레이션
-- 파일: migration-view-count.sql
-- =====================================================

-- 1. posts 테이블에 view_count 컬럼 추가
ALTER TABLE posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- 2. 조회 기록 테이블 생성 (중복 조회 방지용)
CREATE TABLE IF NOT EXISTS post_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_hash TEXT, -- 비로그인 사용자용 (IP 해시)
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 같은 사용자/IP가 같은 글을 하루에 한 번만 카운트
  UNIQUE(post_id, user_id),
  UNIQUE(post_id, ip_hash)
);

-- 3. post_views 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_user_id ON post_views(user_id);
CREATE INDEX IF NOT EXISTS idx_post_views_viewed_at ON post_views(viewed_at);

-- 4. 조회수 증가 함수 (중복 방지 포함)
CREATE OR REPLACE FUNCTION increment_view_count(
  p_post_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_ip_hash TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_already_viewed BOOLEAN := FALSE;
BEGIN
  -- 이미 조회한 적 있는지 확인
  IF p_user_id IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM post_views 
      WHERE post_id = p_post_id AND user_id = p_user_id
    ) INTO v_already_viewed;
  ELSIF p_ip_hash IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM post_views 
      WHERE post_id = p_post_id AND ip_hash = p_ip_hash
    ) INTO v_already_viewed;
  END IF;

  -- 아직 조회하지 않았다면 조회수 증가
  IF NOT v_already_viewed THEN
    -- 조회 기록 삽입
    INSERT INTO post_views (post_id, user_id, ip_hash)
    VALUES (p_post_id, p_user_id, p_ip_hash)
    ON CONFLICT DO NOTHING;

    -- 조회수 증가
    UPDATE posts SET view_count = view_count + 1 WHERE id = p_post_id;
    
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. posts_with_counts 뷰 업데이트 (view_count 포함)
DROP VIEW IF EXISTS posts_with_counts;
CREATE VIEW posts_with_counts AS
SELECT 
  p.id,
  p.user_id,
  p.content,
  p.tag,
  p.image_url,
  p.is_permanent,
  p.created_at,
  p.expires_at,
  p.view_count,
  u.nickname AS author_nickname,
  u.profile_image_url AS author_profile_image_url,
  COALESCE(r.reactions_count, 0) AS reactions_count,
  COALESCE(c.comments_count, 0) AS comments_count,
  r.reactions_by_type
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN (
  SELECT 
    post_id, 
    COUNT(*) AS reactions_count,
    jsonb_object_agg(reaction_type, type_count) AS reactions_by_type
  FROM (
    SELECT post_id, reaction_type, COUNT(*) AS type_count
    FROM reactions
    GROUP BY post_id, reaction_type
  ) reaction_counts
  GROUP BY post_id
) r ON p.id = r.post_id
LEFT JOIN (
  SELECT post_id, COUNT(*) AS comments_count
  FROM comments
  GROUP BY post_id
) c ON p.id = c.post_id;

-- 6. post_views 테이블 RLS 정책
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- 누구나 조회 기록 삽입 가능 (자신의 기록만)
CREATE POLICY "Users can insert own view records" ON post_views
  FOR INSERT WITH CHECK (
    user_id IS NULL OR user_id = auth.uid()
  );

-- 자신의 조회 기록만 조회 가능
CREATE POLICY "Users can view own view records" ON post_views
  FOR SELECT USING (
    user_id = auth.uid() OR ip_hash IS NOT NULL
  );

-- 7. RPC 함수에 대한 실행 권한 부여
GRANT EXECUTE ON FUNCTION increment_view_count TO authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count TO anon;

-- 8. posts_with_counts 뷰에 대한 권한 부여
GRANT SELECT ON posts_with_counts TO authenticated;
GRANT SELECT ON posts_with_counts TO anon;
