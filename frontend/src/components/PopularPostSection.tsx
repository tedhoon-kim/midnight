import { Heart } from 'lucide-react';

export const PopularPostSection = () => {
  return (
    <section className="w-full px-6 py-10 md:px-20 md:py-16 flex flex-col items-center gap-6 md:gap-8">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 md:gap-2">
        <span className="text-midnight-text-muted font-mono text-[10px] md:text-xs font-medium">
          어젯밤의 이야기
        </span>
        <h3 className="text-white text-base md:text-xl font-semibold">
          전날 가장 많은 공명을 받은 글
        </h3>
      </div>

      {/* Post Card */}
      <div className="w-full max-w-[640px] bg-midnight-card border border-midnight-border p-5 md:p-8 flex flex-col gap-4 md:gap-5">
        <p className="text-midnight-text-secondary leading-relaxed md:leading-[1.7] text-sm md:text-base">
          "오늘 결혼식 끝. 다들 축하한다고 하는데, 집 오자마자 화장 지우면서 그냥 펑펑 울었어. 기뻐서가 아니라 그냥 너무 무거워서."
        </p>

        <div className="w-full flex items-center justify-between">
          <span className="text-midnight-text-subtle font-mono text-[11px]">
            어젯밤 02:34
          </span>

          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-midnight-text-subtle" />
            <span className="text-midnight-text-muted font-mono text-xs font-medium">
              127
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
