import { useState, useRef, useEffect } from 'react';
import { X, Camera, RefreshCw, User } from 'lucide-react';
import { Spinner } from '../ui/Spinner';
import { validateNickname, generateRandomNickname, updateProfile } from '../../lib/api/users';
import { uploadProfileImage } from '../../lib/api/storage';
import type { User as UserType } from '../../lib/database.types';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onUpdate: (updatedUser: UserType) => void;
}

const MAX_NICKNAME_LENGTH = 12;

export const ProfileEditModal = ({ 
  isOpen, 
  onClose, 
  user,
  onUpdate 
}: ProfileEditModalProps) => {
  const [nickname, setNickname] = useState(user.nickname);
  const [previewImage, setPreviewImage] = useState<string | null>(user.profile_image_url);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setNickname(user.nickname);
      setPreviewImage(user.profile_image_url);
      setSelectedFile(null);
      setError(null);
    }
  }, [isOpen, user]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('이미지는 2MB 이하여야 해요');
      return;
    }

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능해요');
      return;
    }

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setError(null);
  };

  const handleRandomNickname = () => {
    const newNickname = generateRandomNickname();
    setNickname(newNickname);
    setError(null);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_NICKNAME_LENGTH) {
      setNickname(value);
      setError(null);
    }
  };

  const handleSave = async () => {
    // 닉네임 유효성 검사
    const validation = validateNickname(nickname);
    if (!validation.isValid) {
      setError(validation.error || '닉네임을 확인해주세요');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let newProfileImageUrl = user.profile_image_url;

      // 새 이미지가 선택된 경우 업로드
      if (selectedFile) {
        newProfileImageUrl = await uploadProfileImage(selectedFile, user.id);
      }

      // 프로필 업데이트
      const updatedUser = await updateProfile(user.id, {
        nickname: nickname.trim(),
        profile_image_url: newProfileImageUrl,
      });

      onUpdate(updatedUser);
      onClose();
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err instanceof Error ? err.message : '저장에 실패했어요');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-[400px] bg-[#121316] border border-[#1E1E24] rounded-lg p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white text-lg font-semibold">프로필 수정</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#1E1E24] rounded transition-colors"
          >
            <X className="w-5 h-5 text-[#666666]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 items-center">
          {/* Avatar Edit */}
          <div className="flex flex-col gap-3 items-center">
            {/* Avatar Preview */}
            <div className="w-20 h-20 bg-[#1E1E24] rounded-full flex items-center justify-center overflow-hidden">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="프로필" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-[#666666]" />
              )}
            </div>

            {/* Change Photo Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D0D0F] border border-[#1E1E24] rounded hover:bg-[#1E1E24] transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-[#888888]" />
              <span className="text-xs font-medium text-[#888888]">사진 변경</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Nickname Section */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#888888]">닉네임</label>
            
            <div className="flex gap-2">
              <div className="flex-1 flex items-center justify-between bg-[#0D0D0F] border border-[#1E1E24] px-4 py-3">
                <input
                  type="text"
                  value={nickname}
                  onChange={handleNicknameChange}
                  placeholder="닉네임을 입력하세요"
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#404040]"
                />
                <span className="text-[#404040] text-xs font-mono ml-2">
                  {nickname.length}/{MAX_NICKNAME_LENGTH}
                </span>
              </div>
              
              {/* Random Nickname Button */}
              <button
                onClick={handleRandomNickname}
                className="px-3 bg-[#0D0D0F] border border-[#1E1E24] hover:bg-[#1E1E24] transition-colors"
                title="랜덤 닉네임"
              >
                <RefreshCw className="w-4 h-4 text-[#888888]" />
              </button>
            </div>

            <p className="text-[11px] text-[#404040]">
              2~12자, 한글/영문/숫자 사용 가능
            </p>

            {/* Error Message */}
            {error && (
              <p className="text-xs text-status-error">{error}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-3 bg-[#0D0D0F] border border-[#1E1E24] text-[#888888] text-sm font-medium hover:bg-[#1E1E24] transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-5 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                <span>저장 중...</span>
              </>
            ) : (
              '저장'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
