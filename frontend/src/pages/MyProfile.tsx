import { useState } from 'react';
import { User, Heart, MessageCircle, FileText, Settings, LogOut, ChevronRight, CloudMoon, HeartCrack, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeaderWithBack } from '../components/common/HeaderWithBack';

type TabType = 'posts' | 'reactions' | 'comments';
type TagType = 'monologue' | 'comfort' | 'shout';

const tagConfig = {
  monologue: { label: '혼잣말', icon: CloudMoon, color: '#9B8AA6', bg: '#1A1520' },
  comfort: { label: '위로가 필요해', icon: HeartCrack, color: '#E8B4B8', bg: '#201518' },
  shout: { label: '세상에 외친다', icon: Megaphone, color: '#7BA3C9', bg: '#151A20' },
};

// Mock user data
const userData = {
  nickname: '새벽의 별',
  joinDate: '2025년 1월 가입',
  stats: {
    posts: 12,
    reactions: 156,
    comments: 48,
  },
};

// Mock posts data
const myPosts = [
  { id: 1, tag: 'monologue' as TagType, content: '오늘 하루도 무사히 끝났다. 내일은 더 나은 하루가 되길.', time: '어제 01:23', reactions: 24, comments: 5 },
  { id: 2, tag: 'comfort' as TagType, content: '요즘 너무 지치는 것 같아요. 누가 괜찮다고 말해줬으면...', time: '3일 전 02:45', reactions: 89, comments: 23 },
  { id: 3, tag: 'shout' as TagType, content: '합격했어요!!! 6개월간의 노력이 드디어 결실을 맺었습니다!', time: '1주 전 00:12', reactions: 156, comments: 42 },
];

export const MyProfile = () => {
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  const tabs = [
    { id: 'posts' as TabType, label: '내 글', icon: FileText, count: userData.stats.posts },
    { id: 'reactions' as TabType, label: '공감한 글', icon: Heart, count: userData.stats.reactions },
    { id: 'comments' as TabType, label: '댓글 단 글', icon: MessageCircle, count: userData.stats.comments },
  ];

  return (
    <div className="min-h-screen bg-midnight-bg">
      <HeaderWithBack title="내 프로필" />

      {/* Profile Card */}
      <section className="px-5 py-6">
        <div className="bg-midnight-card border border-midnight-border rounded-2xl p-6">
          {/* Avatar & Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-midnight-text-primary mb-1">
                {userData.nickname}
              </h2>
              <p className="text-midnight-text-muted text-sm font-mono">
                {userData.joinDate}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-midnight-bg rounded-xl">
            <div className="text-center">
              <p className="text-xl font-bold text-midnight-text-primary">{userData.stats.posts}</p>
              <p className="text-midnight-text-muted text-xs mt-1">작성한 글</p>
            </div>
            <div className="text-center border-x border-midnight-border">
              <p className="text-xl font-bold text-midnight-text-primary">{userData.stats.reactions}</p>
              <p className="text-midnight-text-muted text-xs mt-1">받은 공감</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-midnight-text-primary">{userData.stats.comments}</p>
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
        <div className="flex flex-col gap-3">
          {myPosts.map((post) => {
            const config = tagConfig[post.tag];
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
                  <span className="text-midnight-text-subtle font-mono text-xs">{post.time}</span>
                </div>

                {/* Content Preview */}
                <p className="text-midnight-text-secondary text-sm leading-relaxed line-clamp-2 mb-3">
                  {post.content}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-midnight-text-muted">
                  <span className="flex items-center gap-1 text-xs">
                    <Heart className="w-3.5 h-3.5" />
                    {post.reactions}
                  </span>
                  <span className="flex items-center gap-1 text-xs">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post.comments}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Settings Menu */}
      <section className="px-5 py-4 mt-4 border-t border-midnight-border">
        <h3 className="text-midnight-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
          설정
        </h3>
        <div className="bg-midnight-card border border-midnight-border rounded-xl overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-midnight-border/50 transition-colors">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-midnight-text-muted" />
              <span className="text-midnight-text-secondary text-sm">알림 설정</span>
            </div>
            <ChevronRight className="w-4 h-4 text-midnight-text-subtle" />
          </button>
          <div className="border-t border-midnight-border" />
          <button className="w-full flex items-center justify-between p-4 hover:bg-midnight-border/50 transition-colors text-status-error">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="text-sm">로그아웃</span>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};
