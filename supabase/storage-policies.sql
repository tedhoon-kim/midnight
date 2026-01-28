-- ============================================
-- Storage Bucket Policies for post-images
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. 먼저 post-images 버킷이 있는지 확인하고 없으면 생성
-- (참고: 버킷 생성은 Dashboard에서 하는 것이 더 안전합니다)

-- 2. Storage 정책 설정

-- 모든 사용자가 이미지 읽기 가능 (Public)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

-- 인증된 사용자만 이미지 업로드 가능
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post-images' 
  AND auth.role() = 'authenticated'
);

-- 자신이 업로드한 이미지만 삭제 가능
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- 완료!
-- ============================================
