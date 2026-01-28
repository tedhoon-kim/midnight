-- ============================================
-- Midnight Database Schema
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. Tables
-- ============================================

-- Users: 익명 사용자
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nickname TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('kakao', 'google')),
  provider_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(provider, provider_id)
);

-- Posts: 새벽 글
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  tag TEXT NOT NULL CHECK (tag IN ('monologue', 'comfort', 'shout')),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  -- 매일 새벽 4시에 만료 (단순화: 생성 후 다음 04:00)
  expires_at TIMESTAMPTZ DEFAULT (
    (date_trunc('day', now() AT TIME ZONE 'Asia/Seoul') + INTERVAL '1 day 4 hours') AT TIME ZONE 'Asia/Seoul'
  )
);

-- Reactions: 공감 (글에 대한)
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Comments: 댓글
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Comment Likes: 댓글 좋아요
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, comment_id)
);

-- ============================================
-- 3. Indexes (성능 최적화)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_tag ON posts(tag);
CREATE INDEX IF NOT EXISTS idx_posts_expires_at ON posts(expires_at);

CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);

-- ============================================
-- 4. Views (편의를 위한 뷰)
-- ============================================

-- 글 목록 뷰 (reactions, comments count 포함)
CREATE OR REPLACE VIEW posts_with_counts AS
SELECT 
  p.*,
  u.nickname as author_nickname,
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

-- 댓글 목록 뷰 (likes count 포함)
CREATE OR REPLACE VIEW comments_with_counts AS
SELECT 
  c.*,
  u.nickname as author_nickname,
  COALESCE(cl.likes_count, 0)::integer as likes_count
FROM comments c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN (
  SELECT comment_id, COUNT(*)::integer as likes_count 
  FROM comment_likes 
  GROUP BY comment_id
) cl ON c.id = cl.comment_id;

-- ============================================
-- 5. Functions
-- ============================================

-- 시간 체크 함수: 현재 새벽 시간인지 확인 (00:00 ~ 04:00 KST)
CREATE OR REPLACE FUNCTION is_midnight_hours()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXTRACT(HOUR FROM now() AT TIME ZONE 'Asia/Seoul') >= 0 
     AND EXTRACT(HOUR FROM now() AT TIME ZONE 'Asia/Seoul') < 4;
END;
$$ LANGUAGE plpgsql STABLE;

-- 만료된 글 삭제 함수
CREATE OR REPLACE FUNCTION delete_expired_posts()
RETURNS void AS $$
BEGIN
  DELETE FROM posts WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- 닉네임 랜덤 생성 함수
CREATE OR REPLACE FUNCTION generate_random_nickname()
RETURNS TEXT AS $$
DECLARE
  adjectives TEXT[] := ARRAY['잠 못 드는', '새벽의', '밤을 걷는', '별을 보는', '달빛 아래', '고요한', '외로운', '따뜻한', '조용한', '꿈꾸는'];
  nouns TEXT[] := ARRAY['올빼미', '고양이', '여우', '토끼', '곰', '별', '달', '바람', '구름', '밤하늘', '산책러', '몽상가', '시인', '나그네'];
BEGIN
  RETURN adjectives[1 + floor(random() * array_length(adjectives, 1))] || ' ' || 
         nouns[1 + floor(random() * array_length(nouns, 1))];
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. Row Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own record" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own record" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Posts policies
-- 개발/테스트 편의를 위해 시간 제한 없이 설정 (나중에 is_midnight_hours() 추가 가능)
CREATE POLICY "Anyone can read posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (user_id::text = auth.uid()::text);

-- Reactions policies
CREATE POLICY "Anyone can read reactions" ON reactions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reactions" ON reactions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own reactions" ON reactions
  FOR DELETE USING (user_id::text = auth.uid()::text);

-- Comments policies
CREATE POLICY "Anyone can read comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (user_id::text = auth.uid()::text);

-- Comment likes policies
CREATE POLICY "Anyone can read comment likes" ON comment_likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comment likes" ON comment_likes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own comment likes" ON comment_likes
  FOR DELETE USING (user_id::text = auth.uid()::text);

-- ============================================
-- 7. Storage Bucket (이미지 업로드용)
-- Supabase Dashboard > Storage에서 수동 생성 필요
-- ============================================
-- Bucket 이름: post-images
-- Public: true

-- ============================================
-- 완료!
-- ============================================
