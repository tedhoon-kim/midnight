-- ============================================
-- Migration: 다중 리액션 타입 지원
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. 기존 reactions 테이블에 reaction_type 컬럼 추가
ALTER TABLE reactions 
ADD COLUMN IF NOT EXISTS reaction_type TEXT DEFAULT 'heart';

-- 2. 기존 UNIQUE 제약 조건 삭제
ALTER TABLE reactions 
DROP CONSTRAINT IF EXISTS reactions_user_id_post_id_key;

-- 3. 새로운 UNIQUE 제약 조건 추가 (user_id, post_id, reaction_type)
-- 같은 유저가 같은 글에 여러 종류의 리액션을 달 수 있음
ALTER TABLE reactions 
ADD CONSTRAINT reactions_user_id_post_id_reaction_type_key 
UNIQUE (user_id, post_id, reaction_type);

-- 4. reaction_type 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_reactions_type ON reactions(reaction_type);

-- 5. posts_with_counts 뷰 업데이트 (리액션 타입별 카운트)
DROP VIEW IF EXISTS posts_with_counts;

CREATE VIEW posts_with_counts 
WITH (security_invoker = true)
AS
SELECT 
  p.*,
  u.nickname as author_nickname,
  COALESCE(r.reactions_count, 0)::integer as reactions_count,
  COALESCE(c.comments_count, 0)::integer as comments_count,
  r.reactions_by_type
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN (
  SELECT 
    post_id, 
    COUNT(*)::integer as reactions_count,
    jsonb_object_agg(
      reaction_type, 
      type_count
    ) as reactions_by_type
  FROM (
    SELECT 
      post_id, 
      reaction_type, 
      COUNT(*)::integer as type_count
    FROM reactions 
    GROUP BY post_id, reaction_type
  ) sub
  GROUP BY post_id
) r ON p.id = r.post_id
LEFT JOIN (
  SELECT post_id, COUNT(*)::integer as comments_count 
  FROM comments 
  GROUP BY post_id
) c ON p.id = c.post_id;

-- ============================================
-- 완료!
-- ============================================
