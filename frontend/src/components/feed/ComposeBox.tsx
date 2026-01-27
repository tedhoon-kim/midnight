import { Image } from 'lucide-react';

interface ComposeBoxProps {
  onCompose?: () => void;
}

export const ComposeBox = ({ onCompose }: ComposeBoxProps) => {
  return (
    <div className="w-full bg-midnight-card border border-midnight-border p-5 md:p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[#888888] text-[15px] font-medium">
          오늘 밤, 무슨 생각을 하고 있나요?
        </span>
      </div>

      {/* Textarea */}
      <div 
        className="w-full min-h-[100px] bg-midnight-bg border border-midnight-border p-4 cursor-pointer hover:border-midnight-text-subtle transition-colors"
        onClick={onCompose}
      >
        <span className="text-midnight-text-subtle text-sm">
          새벽의 솔직한 이야기를 적어보세요...
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-midnight-border rounded transition-colors">
            <Image className="w-5 h-5 text-midnight-text-subtle" />
          </button>
        </div>

        <button 
          onClick={onCompose}
          className="bg-white text-black px-5 py-2.5 text-[13px] font-semibold hover:bg-gray-100 transition-colors"
        >
          이야기 남기기
        </button>
      </div>
    </div>
  );
};
