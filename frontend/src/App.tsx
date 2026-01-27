import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TimerSection } from './components/TimerSection';
import { OpenTimeInfo } from './components/OpenTimeInfo';
import { SocialLoginSection } from './components/SocialLoginSection';
import { PopularPostSection } from './components/PopularPostSection';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-midnight-bg flex flex-col items-center">
      <Header />
      <HeroSection />
      <TimerSection />
      <OpenTimeInfo />
      <SocialLoginSection />
      
      {/* Divider */}
      <div className="w-full h-px bg-midnight-border"></div>
      
      <PopularPostSection />
      
      {/* Divider */}
      <div className="w-full h-px bg-midnight-border"></div>
      
      <Footer />
    </div>
  );
}

export default App;
