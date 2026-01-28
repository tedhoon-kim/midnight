-- ============================================
-- Migration: View에 프로필 이미지 추가
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. 기존 뷰 삭제
DROP VIEW IF EXISTS posts_with_counts;
DROP VIEW IF EXISTS comments_with_counts;

-- 2. posts_with_counts 뷰 재생성 (author_profile_image_url 추가)
CREATE VIEW posts_with_counts AS
SELECT 
  p.*,
  u.nickname as author_nickname,
  u.profile_image_url as author_profile_image_url,
  COALESCE(r.reactions_count, 0)::integer as reactions_count,
  COALESCE(c.comments_count, 0)::integer as comments_count
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN (
  SELECT post_id, COUNT(*)::integer as reactions_count 
  FROM reactions 
  GROUP BY post_id
) r ON p.id = r.post_id
LEFT JOIN (
  SELECT post_id, COUNT(*)::integer as comments_count 
  FROM comments 
  GROUP BY post_id
) c ON p.id = c.post_id;

-- 3. comments_with_counts 뷰 재생성 (author_profile_image_url 추가)
CREATE VIEW comments_with_counts AS
SELECT 
  c.*,
  u.nickname as author_nickname,
  u.profile_image_url as author_profile_image_url,
  COALESCE(cl.likes_count, 0)::integer as likes_count
FROM comments c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN (
  SELECT comment_id, COUNT(*)::integer as likes_count 
  FROM comment_likes 
  GROUP BY comment_id
) cl ON c.id = cl.comment_id;

-- ============================================
-- 완료!
-- ============================================
