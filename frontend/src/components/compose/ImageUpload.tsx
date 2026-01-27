import { ImagePlus, X } from 'lucide-react';
import { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageChange?: (file: File | null) => void;
}

export const ImageUpload = ({ onImageChange }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange?.(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (preview) {
    return (
      <div className="relative w-full">
        <img 
          src={preview} 
          alt="Preview" 
          className="w-full h-48 object-cover rounded-lg"
        />
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full hover:bg-black transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="w-full h-[120px] bg-midnight-bg border border-midnight-border border-dashed rounded-lg flex flex-col items-center justify-center gap-3 hover:border-midnight-text-subtle transition-colors"
      >
        <ImagePlus className="w-8 h-8 text-midnight-text-dim" />
        <span className="text-midnight-text-subtle text-[13px]">
          이미지 추가 (선택사항)
        </span>
      </button>
    </>
  );
};
