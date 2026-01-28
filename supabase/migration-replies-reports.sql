-- ================================================
-- Migration: 대댓글(답글) 및 신고 기능
-- ================================================

-- ================================================
-- 1. comments 테이블에 parent_id 추가 (대댓글)
-- ================================================

-- parent_id 컬럼 추가
ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;

-- parent_id 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- ================================================
-- 2. reports 테이블 생성 (신고 기능)
-- ================================================

-- 신고 타입 enum
DO $$ BEGIN
  CREATE TYPE report_target_type AS ENUM ('post', 'comment');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 신고 사유 enum
DO $$ BEGIN
  CREATE TYPE report_reason_type AS ENUM ('spam', 'abuse', 'harassment', 'inappropriate', 'copyright', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- reports 테이블
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type report_target_type NOT NULL,
  target_id UUID NOT NULL,
  reason report_reason_type NOT NULL,
  detail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON reports(reporter_id);

-- 중복 신고 방지 (같은 유저가 같은 대상을 중복 신고 불가)
CREATE UNIQUE INDEX IF NOT EXISTS idx_reports_unique ON reports(reporter_id, target_type, target_id);

-- RLS 정책
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 누구나 신고 가능 (로그인 사용자)
CREATE POLICY "Users can create reports" ON reports
  FOR INSERT
  WITH CHECK (auth.uid()::text = reporter_id::text);

-- 본인이 신고한 것만 조회 가능
CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT
  USING (auth.uid()::text = reporter_id::text);

-- ================================================
-- 3. comments_with_counts 뷰 업데이트 (replies_count 추가)
-- ================================================

DROP VIEW IF EXISTS comments_with_counts;

CREATE VIEW comments_with_counts AS
SELECT 
  c.id,
  c.user_id,
  c.post_id,
  c.parent_id,
  c.content,
  c.created_at,
  u.nickname AS author_nickname,
  u.profile_image_url AS author_profile_image_url,
  COALESCE(likes.cnt, 0) AS likes_count,
  COALESCE(replies.cnt, 0) AS replies_count
FROM comments c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN (
  SELECT comment_id, COUNT(*) AS cnt
  FROM comment_likes
  GROUP BY comment_id
) likes ON c.id = likes.comment_id
LEFT JOIN (
  SELECT parent_id, COUNT(*) AS cnt
  FROM comments
  WHERE parent_id IS NOT NULL
  GROUP BY parent_id
) replies ON c.id = replies.parent_id;

-- 뷰에 대한 권한 설정
GRANT SELECT ON comments_with_counts TO authenticated, anon;
