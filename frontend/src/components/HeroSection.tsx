export const HeroSection = () => {
  return (
    <section className="w-full px-6 py-12 md:px-20 md:py-20 flex flex-col items-center gap-10 md:gap-12">
      {/* Spline 3D Magic Clock */}
      <div className="relative w-full max-w-[350px] h-[480px] md:max-w-[500px] md:h-[500px]">
        {/* iframe 컨테이너 */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-midnight-bg">
          <iframe
            src="https://my.spline.design/magiclock-fVLeCmqaZIHQgawxnb9EtE0n/"
            frameBorder="0"
            width="100%"
            height="100%"
            className="w-full h-full"
            title="Magic Clock - Midnight"
          />
        </div>
        
        {/* Spline 워터마크 오버레이 */}
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-[170px] h-[60px] bg-midnight-bg z-10 rounded-md"></div>
      </div>

      {/* Hero Text */}
      <div className="flex flex-col items-center gap-4 md:gap-5">
        <h2 className="text-white text-[28px] md:text-[42px] font-semibold text-center leading-tight">
          지금은 문이 닫혀있어요
        </h2>
        <p className="text-midnight-text-muted font-mono text-sm md:text-[15px] text-center">
          새벽에만 열리는 커뮤니티
        </p>
      </div>
    </section>
  );
};
