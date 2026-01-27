import { MessageCircle, Mail } from 'lucide-react';

export const SocialLoginSection = () => {
  return (
    <section className="w-full px-6 py-10 md:px-20 md:py-14 flex flex-col items-center gap-5 md:gap-6">
      <span className="text-midnight-text-secondary font-mono text-[13px] md:text-[14px] font-medium">
        오픈 알림 받기
      </span>

      <div className="w-full max-w-md flex flex-col md:flex-row items-center gap-3 md:gap-3.5">
        {/* Kakao Login Button */}
        <button className="w-full md:w-[210px] h-12 md:h-[52px] bg-social-kakao rounded-lg flex items-center justify-center gap-2.5 hover:opacity-90 transition-all duration-200 shadow-md">
          <MessageCircle className="w-[18px] h-[18px] text-black" />
          <span className="text-black font-medium text-[14px] md:text-[15px]">
            카카오로 시작하기
          </span>
        </button>

        {/* Google Login Button */}
        <button className="w-full md:w-[210px] h-12 md:h-[52px] bg-social-google border border-midnight-border rounded-lg flex items-center justify-center gap-2.5 hover:bg-gray-50 transition-all duration-200 shadow-md">
          <Mail className="w-[18px] h-[18px] text-gray-700" />
          <span className="text-gray-900 font-medium text-[14px] md:text-[15px]">
            Google로 시작하기
          </span>
        </button>
      </div>
    </section>
  );
};
