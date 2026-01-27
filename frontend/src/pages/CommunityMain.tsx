import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderOpen } from '../components/common/HeaderOpen';
import { ComposeBox } from '../components/feed/ComposeBox';
import { FilterTabs } from '../components/feed/FilterTabs';
import { HotPostsSection } from '../components/feed/HotPostsSection';
import { PostList } from '../components/feed/PostList';
import { Footer } from '../components/common/Footer';

type TabType = 'all' | 'monologue' | 'comfort' | 'shout';

export const CommunityMain = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const handleCompose = () => {
    navigate('/compose');
  };

  const handlePostClick = (id: number) => {
    navigate(`/post/${id}`);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };
  void handleProfileClick; // Mark as intentionally unused for now

  return (
    <div className="min-h-screen bg-midnight-bg flex flex-col items-center">
      <HeaderOpen 
        timeLeft="03:47:22 남음" 
        nickname="익명의 올빼미" 
      />
      
      {/* Main Content */}
      <main className="w-full max-w-[640px] px-5 md:px-0 py-8 md:py-12 flex flex-col gap-8">
        {/* Compose Section */}
        <ComposeBox onCompose={handleCompose} />
        
        {/* Filter Section */}
        <div className="flex flex-col gap-5">
          <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          {/* Hot Posts */}
          <HotPostsSection onPostClick={handlePostClick} />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-midnight-border"></div>
        
        {/* Post List */}
        <PostList onPostClick={handlePostClick} />
      </main>
      
      <Footer />
    </div>
  );
};
