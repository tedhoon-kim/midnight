import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Spinner } from '../components/ui/Spinner';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login?error=auth_failed');
          return;
        }

        if (session) {
          // 로그인 성공 - 커뮤니티로 이동
          navigate('/community');
        } else {
          // 세션 없음 - 로그인 페이지로
          navigate('/login');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        navigate('/login?error=auth_failed');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-midnight-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-midnight-text-secondary">로그인 처리 중...</p>
      </div>
    </div>
  );
};
