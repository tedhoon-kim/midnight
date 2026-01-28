import { supabase } from '../supabase';

const POST_IMAGES_BUCKET = 'post-images';
const PROFILE_IMAGES_BUCKET = 'profile-images';

// 최대 파일 크기 (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// 게시글 이미지 업로드
export async function uploadImage(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  console.log('uploadImage called:', { fileName, fileSize: file.size, fileType: file.type });

  const { data, error } = await supabase.storage
    .from(POST_IMAGES_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  console.log('uploadImage result:', { data, error });

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  // Public URL 반환
  const { data: { publicUrl } } = supabase.storage
    .from(POST_IMAGES_BUCKET)
    .getPublicUrl(fileName);

  console.log('uploadImage publicUrl:', publicUrl);

  return publicUrl;
}

// 프로필 이미지 업로드
export async function uploadProfileImage(file: File, userId: string): Promise<string> {
  // 파일 크기 체크
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('이미지는 2MB 이하여야 해요');
  }

  // 이미지 파일만 허용
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일만 업로드 가능해요');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/profile.${fileExt}`;

  console.log('uploadProfileImage called:', { fileName, fileSize: file.size, fileType: file.type });

  // 기존 프로필 이미지 삭제 후 새로 업로드 (upsert)
  const { data, error } = await supabase.storage
    .from(PROFILE_IMAGES_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true, // 기존 파일 덮어쓰기
    });

  console.log('uploadProfileImage result:', { data, error });

  if (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }

  // Public URL 반환 (캐시 무효화를 위해 타임스탬프 추가)
  const { data: { publicUrl } } = supabase.storage
    .from(PROFILE_IMAGES_BUCKET)
    .getPublicUrl(fileName);

  return `${publicUrl}?t=${Date.now()}`;
}

// 프로필 이미지 삭제
export async function deleteProfileImage(userId: string) {
  // 가능한 확장자들 삭제 시도
  const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  
  for (const ext of extensions) {
    const fileName = `${userId}/profile.${ext}`;
    await supabase.storage
      .from(PROFILE_IMAGES_BUCKET)
      .remove([fileName]);
  }
}

// 게시글 이미지 삭제
export async function deleteImage(imageUrl: string) {
  // URL에서 파일 경로 추출
  const url = new URL(imageUrl);
  const pathParts = url.pathname.split('/');
  const filePath = pathParts.slice(pathParts.indexOf(POST_IMAGES_BUCKET) + 1).join('/');

  const { error } = await supabase.storage
    .from(POST_IMAGES_BUCKET)
    .remove([filePath]);

  if (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}
