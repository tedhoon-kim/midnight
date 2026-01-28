-- ============================================
-- Migration: 프로필 이미지 기능 추가
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. users 테이블에 profile_image_url 컬럼 추가
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- 2. profile-images 버킷 정책 (버킷은 Dashboard에서 수동 생성 필요)
-- Bucket 이름: profile-images
-- Public: true

-- 모든 사용자가 프로필 이미지 읽기 가능 (Public)
CREATE POLICY "Public can read profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

-- 인증된 사용자만 자신의 폴더에 이미지 업로드 가능
CREATE POLICY "Users can upload own profile image"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' 
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 자신이 업로드한 이미지만 수정 가능
CREATE POLICY "Users can update own profile image"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 자신이 업로드한 이미지만 삭제 가능
CREATE POLICY "Users can delete own profile image"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- 완료!
-- 
-- 주의: Supabase Dashboard > Storage에서 
-- 'profile-images' 버킷을 Public으로 수동 생성하세요
-- ============================================
