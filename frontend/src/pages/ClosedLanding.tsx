import { Header } from '../components/common/Header';
import { HeroSection } from '../components/HeroSection';
import { TimerSection } from '../components/TimerSection';
import { OpenTimeInfo } from '../components/OpenTimeInfo';
import { SocialLoginSection } from '../components/SocialLoginSection';
import { PopularPostSection } from '../components/PopularPostSection';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';

export const ClosedLanding = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-midnight-bg flex flex-col items-center">
      <Header />
      <HeroSection />
      <TimerSection />
      <OpenTimeInfo />
      
      {/* Social Login Section - 비로그인 시에만 표시 */}
      {!user && <SocialLoginSection />}
      
      {/* Divider */}
      <div className="w-full h-px bg-midnight-border"></div>
      
      <PopularPostSection />
      
      {/* Divider */}
      <div className="w-full h-px bg-midnight-border"></div>
      
      <Footer />
    </div>
  );
};
