-- ============================================
-- Migration: 태그 확장 및 글 유지 설정
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. posts 테이블에 is_permanent 컬럼 추가
-- false: 새벽 4시에 자동 삭제 (기본값)
-- true: 계속 유지 (삭제하기 전까지)
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS is_permanent BOOLEAN DEFAULT false;

-- 2. 태그 제약 조건 업데이트 (6종류로 확장)
-- 기존: monologue, comfort, shout
-- 추가: emotion (새벽감성), food (야식/음료), music (음악)
ALTER TABLE posts 
DROP CONSTRAINT IF EXISTS posts_tag_check;

ALTER TABLE posts 
ADD CONSTRAINT posts_tag_check 
CHECK (tag IN ('monologue', 'comfort', 'shout', 'emotion', 'food', 'music'));

-- 3. is_permanent가 true인 글은 expires_at을 null로 설정하는 트리거
CREATE OR REPLACE FUNCTION set_expires_at_for_post()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_permanent = true THEN
    NEW.expires_at = NULL;
  ELSE
    -- 오늘만 유지: 다음 새벽 4시에 만료
    NEW.expires_at = (date_trunc('day', now() AT TIME ZONE 'Asia/Seoul') + INTERVAL '1 day 4 hours') AT TIME ZONE 'Asia/Seoul';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 기존 트리거 삭제 후 재생성
DROP TRIGGER IF EXISTS set_post_expires_at ON posts;

CREATE TRIGGER set_post_expires_at
BEFORE INSERT OR UPDATE OF is_permanent ON posts
FOR EACH ROW
EXECUTE FUNCTION set_expires_at_for_post();

-- 4. 만료된 글 삭제 함수 업데이트 (is_permanent = false인 것만)
CREATE OR REPLACE FUNCTION delete_expired_posts()
RETURNS void AS $$
BEGIN
  DELETE FROM posts 
  WHERE expires_at IS NOT NULL 
    AND expires_at < now() 
    AND is_permanent = false;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 완료!
-- ============================================
