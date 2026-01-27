import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderWithBack } from '../components/common/HeaderWithBack';
import { TagSelector } from '../components/compose/TagSelector';
import { ImageUpload } from '../components/compose/ImageUpload';

type TagType = 'monologue' | 'comfort' | 'shout';

const MAX_LENGTH = 500;

export const Compose = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!content.trim() || !selectedTag) return;
    
    // API 호출 로직
    console.log('Submit:', { content, tag: selectedTag, image: imageFile });
    
    // 성공 후 커뮤니티로 이동
    navigate('/community');
  };

  const isValid = content.trim().length > 0 && selectedTag !== null;

  return (
    <div className="min-h-screen bg-midnight-bg flex flex-col items-center">
      <HeaderWithBack showTime={true} />
      
      {/* Main Content */}
      <main className="w-full max-w-[640px] px-5 md:px-0 py-8 md:py-12 flex flex-col gap-6">
        {/* Compose Card */}
        <div className="w-full bg-midnight-card border border-midnight-border p-6 md:p-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg font-semibold">
              새벽의 이야기를 적어보세요
            </h2>
            <span className="text-midnight-text-subtle font-mono text-xs">
              {content.length} / {MAX_LENGTH}
            </span>
          </div>

          {/* Textarea */}
          <div className="w-full">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
              placeholder={`지금 무슨 생각을 하고 있나요?\n\n새벽의 솔직한 감정, 아무도 모르게 털어놓고 싶은 이야기,\n혼자 삼키기엔 무거운 고민들...\n\n여기선 모두가 익명이에요. 편하게 적어보세요.`}
              className="w-full min-h-[240px] bg-midnight-bg border border-midnight-border rounded-lg p-5 text-white text-[15px] leading-[1.8] resize-none placeholder:text-midnight-text-subtle focus:outline-none focus:border-midnight-text-muted"
            />
          </div>

          {/* Image Upload */}
          <ImageUpload onImageChange={setImageFile} />

          {/* Tag Selector */}
          <TagSelector selectedTag={selectedTag} onSelect={setSelectedTag} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-midnight-text-subtle text-[13px]">
            새벽 4시가 되면 모든 글이 사라져요
          </p>
          
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-white text-black px-6 py-3 text-[14px] font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이야기 남기기
          </button>
        </div>
      </main>
    </div>
  );
};
