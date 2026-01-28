import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderOpen } from '../components/common/HeaderOpen';
import { ComposeBox } from '../components/feed/ComposeBox';
import { FilterTabs } from '../components/feed/FilterTabs';
import type { TabType } from '../components/feed/FilterTabs';
import { SortFilter } from '../components/feed/SortFilter';
import { HotPostsSection } from '../components/feed/HotPostsSection';
import { PostList } from '../components/feed/PostList';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useMidnightAccess } from '../hooks/useMidnightAccess';
import type { SortType } from '../lib/database.types';

export const CommunityMain = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { timeLeft } = useMidnightAccess();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [activeSort, setActiveSort] = useState<SortType>('reactions');

  const handleCompose = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/compose');
  };

  const handlePostClick = (id: string) => {
    navigate(`/post/${id}`);
  };

  const handleProfileClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-midnight-bg flex flex-col items-center">
      <HeaderOpen 
        timeLeft={`${timeLeft} 남음`}
        nickname={user?.nickname || '익명'} 
        onProfileClick={handleProfileClick}
      />
      
      {/* Main Content */}
      <main className="w-full max-w-[640px] px-5 md:px-0 py-8 md:py-12 flex flex-col gap-8">
        {/* Compose Section */}
        <ComposeBox onCompose={handleCompose} />
        
        {/* Filter Section */}
        <div className="flex flex-col gap-5">
          {/* Tag Filter */}
          <FilterTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          {/* Sort Filter */}
          <SortFilter
            activeSort={activeSort}
            onSortChange={setActiveSort}
          />
          
          {/* Hot Posts */}
          <HotPostsSection onPostClick={handlePostClick} />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-midnight-border"></div>
        
        {/* Post List */}
        <PostList 
          tag={activeTab === 'all' ? undefined : activeTab}
          sortBy={activeSort}
          onPostClick={handlePostClick} 
        />
      </main>
      
      <Footer />
    </div>
  );
};
