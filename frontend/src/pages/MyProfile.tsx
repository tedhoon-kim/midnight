import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, MessageCircle, FileText, LogOut, Pencil } from 'lucide-react';
import { HeaderWithBack } from '../components/common/HeaderWithBack';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Avatar } from '../components/ui/Avatar';
import { ProfileEditModal } from '../components/modals/ProfileEditModal';
import { useAuth } from '../contexts/AuthContext';
import { useMidnightAccess } from '../hooks/useMidnightAccess';
import { getMyPosts, getReactedPosts } from '../lib/api/posts';
import { TAG_CONFIG } from '../lib/constants';
import type { PostWithDetails, TagType } from '../lib/database.types';

type TabType = 'posts' | 'reactions' | 'comments';

export const MyProfile = () => {
  const navigate = useNavigate();
  const { user, signOut, updateUser, isLoading: authLoading } = useAuth();
  const { timeLeft } = useMidnightAccess();
  
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [myPosts, setMyPosts] = useState<PostWithDetails[]>([]);
  const [reactedPosts, setReactedPosts] = useState<PostWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [posts, reacted] = await Promise.all([
        getMyPosts(user.id),
        getReactedPosts(user.id),
      ]);
      setMyPosts(posts);
      setReactedPosts(reacted);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // 상대 시간 포맷
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  // 통계 계산
  const stats = {
    posts: myPosts.length,
    reactions: myPosts.reduce((acc, post) => acc + post.reactions_count, 0),
    comments: myPosts.reduce((acc, post) => acc + post.comments_count, 0),
  };

  const tabs = [
    { id: 'posts' as TabType, label: '내 글', icon: FileText, count: stats.posts },
    { id: 'reactions' as TabType, label: '공감한 글', icon: Heart, count: reactedPosts.length },
  ];

  // 현재 탭의 글 목록
  const currentPosts = activeTab === 'posts' ? myPosts : reactedPosts;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-midnight-bg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight-bg">
      <HeaderWithBack title="내 프로필" timeLeft={`${timeLeft} 남음`} />

      {/* Profile Card */}
      <section className="px-5 py-6">
        <div className="bg-midnight-card border border-midnight-border rounded-2xl p-6">
          {/* Avatar & Info */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar 
              src={user?.profile_image_url} 
              alt={user?.nickname || '프로필'}
              size="lg" 
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-midnight-text-primary mb-1">
                {user?.nickname || '익명'}
              </h2>
              <p className="text-midnight-text-muted text-sm font-mono">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }) + ' 가입' : ''}
              </p>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 rounded-full hover:bg-midnight-border/50 transition-colors"
              aria-label="프로필 편집"
            >
              <Pencil className="w-5 h-5 text-midnight-text-muted" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-midnight-bg rounded-xl">
            <div className="text-center">
              <p className="text-xl font-bold text-midnight-text-primary">{stats.posts}</p>
              <p className="text-midnight-text-muted text-xs mt-1">작성한 글</p>
            </div>
            <div className="text-center border-x border-midnight-border">
              <p className="text-xl font-bold text-midnight-text-primary">{stats.reactions}</p>
              <p className="text-midnight-text-muted text-xs mt-1">받은 공감</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-midnight-text-primary">{stats.comments}</p>
              <p className="text-midnight-text-muted text-xs mt-1">댓글</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-5">
        <div className="flex border-b border-midnight-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-400 text-midnight-text-primary'
                    : 'border-transparent text-midnight-text-muted hover:text-midnight-text-secondary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                <span className="text-xs text-midnight-text-subtle">({tab.count})</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Posts List */}
      <section className="px-5 py-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="md" />
          </div>
        ) : currentPosts.length === 0 ? (
          <EmptyState
            type={activeTab === 'posts' ? 'no-my-posts' : 'no-posts'}
            title={activeTab === 'posts' ? '작성한 글이 없어요' : '공감한 글이 없어요'}
            description={activeTab === 'posts' ? '새벽의 이야기를 남겨보세요' : '마음에 드는 글에 공감해보세요'}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {currentPosts.map((post) => {
              const config = TAG_CONFIG[post.tag as TagType];
              const TagIcon = config.icon;
              
              return (
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="bg-midnight-card border border-midnight-border rounded-xl p-4 hover:border-midnight-text-subtle transition-colors"
                >
                  {/* Tag & Time */}
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
                      style={{ backgroundColor: config.bg }}
                    >
                      <TagIcon className="w-3 h-3" style={{ color: config.color }} />
                      <span className="text-[11px] font-medium" style={{ color: config.color }}>
                        {config.label}
                      </span>
                    </div>
                    <span className="text-midnight-text-subtle font-mono text-xs">
                      {formatRelativeTime(post.created_at)}
                    </span>
                  </div>

                  {/* Content Preview */}
                  <p className="text-midnight-text-secondary text-sm leading-relaxed line-clamp-2 mb-3">
                    {post.content}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-midnight-text-muted">
                    <span className="flex items-center gap-1 text-xs">
                      <Heart className="w-3.5 h-3.5" />
                      {post.reactions_count}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.comments_count}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Logout */}
      <section className="px-5 py-4 mt-4 border-t border-midnight-border">
        <div className="bg-midnight-card border border-midnight-border rounded-xl overflow-hidden">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-between p-4 hover:bg-midnight-border/50 transition-colors text-status-error"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="text-sm">로그아웃</span>
            </div>
          </button>
        </div>
      </section>

      {/* Profile Edit Modal */}
      {user && (
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
          onUpdate={updateUser}
        />
      )}
    </div>
  );
};
