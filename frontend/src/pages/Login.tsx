import { MessageCircle, Mail, Moon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Login = () => {
  return (
    <div className="min-h-screen bg-midnight-bg flex flex-col">
      {/* Header with back button */}
      <header className="w-full px-5 py-4 flex items-center">
        <Link to="/" className="p-2 -ml-2 hover:bg-midnight-card rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-midnight-text-secondary" />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Logo & Welcome */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-midnight-card border border-midnight-border flex items-center justify-center">
            <Moon className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-midnight-text-primary mb-2">
              Midnight에 오신 걸 환영해요
            </h1>
            <p className="text-midnight-text-muted text-sm">
              자정부터 새벽 4시, 솔직한 이야기가 시작되는 곳
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-sm bg-midnight-card border border-midnight-border rounded-2xl p-6">
          <div className="flex flex-col gap-3">
            {/* Kakao Login */}
            <button className="w-full h-12 bg-social-kakao rounded-xl flex items-center justify-center gap-2.5 hover:opacity-90 transition-all duration-200 shadow-sm">
              <MessageCircle className="w-5 h-5 text-black" />
              <span className="text-black font-medium text-[15px]">
                카카오로 시작하기
              </span>
            </button>

            {/* Google Login */}
            <button className="w-full h-12 bg-social-google border border-gray-200 rounded-xl flex items-center justify-center gap-2.5 hover:bg-gray-50 transition-all duration-200 shadow-sm">
              <Mail className="w-5 h-5 text-gray-700" />
              <span className="text-gray-900 font-medium text-[15px]">
                Google로 시작하기
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-midnight-border" />
            <span className="text-midnight-text-subtle text-xs font-mono">또는</span>
            <div className="flex-1 h-px bg-midnight-border" />
          </div>

          {/* Guest mode notice */}
          <p className="text-center text-midnight-text-muted text-sm">
            로그인 없이{' '}
            <Link to="/community" className="text-indigo-400 hover:underline">
              둘러보기
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="mt-6 text-midnight-text-subtle text-xs text-center max-w-xs">
          로그인 시{' '}
          <a href="#" className="underline hover:text-midnight-text-muted">이용약관</a>
          {' '}및{' '}
          <a href="#" className="underline hover:text-midnight-text-muted">개인정보처리방침</a>
          에 동의하게 됩니다.
        </p>
      </main>
    </div>
  );
};
