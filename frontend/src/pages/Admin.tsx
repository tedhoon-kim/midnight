import { useEffect, useState } from 'react';
import { ArrowLeft, Moon, Users, FileText, MessageSquare, AlertTriangle, ToggleLeft, ToggleRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { setDevMode } from '../hooks/useMidnightAccess';
import { Spinner } from '../components/ui/Spinner';

// 인증 정보 (해시)
const AUTH_ID = 'dGVk'; // base64
const AUTH_PW = 'MTIzNA=='; // base64
const AUTH_KEY = 'mnt_adm_auth';

function verifyAuth(id: string, pw: string): boolean {
  return btoa(id) === AUTH_ID && btoa(pw) === AUTH_PW;
}

interface Stats {
  users: number;
  posts: number;
  comments: number;
  reports: number;
}

interface RecentReport {
  id: string;
  target_type: 'post' | 'comment';
  reason: string;
  created_at: string;
}

export const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginError, setLoginError] = useState('');

  const [devMode, setDevModeState] = useState(() => {
    return localStorage.getItem('midnight_dev_mode') === 'true';
  });
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (verifyAuth(loginId, loginPw)) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('인증 정보가 올바르지 않습니다');
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  async function loadData() {
    setIsLoading(true);
    try {
      // 통계 로드
      const [usersRes, postsRes, commentsRes, reportsRes] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('comments').select('id', { count: 'exact', head: true }),
        supabase.from('reports').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        users: usersRes.count || 0,
        posts: postsRes.count || 0,
        comments: commentsRes.count || 0,
        reports: reportsRes.count || 0,
      });

      // 최근 신고 5개
      const { data: reports } = await supabase
        .from('reports')
        .select('id, target_type, reason, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentReports(reports || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleDevModeToggle() {
    const newValue = !devMode;
    setDevModeState(newValue);
    setDevMode(newValue);
  }

  const reasonLabels: Record<string, string> = {
    spam: '스팸',
    abuse: '욕설/비방',
    harassment: '괴롭힘',
    inappropriate: '부적절한 내용',
    copyright: '저작권 침해',
    other: '기타',
  };

  // 로그인 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-midnight-bg flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-midnight-card border border-midnight-border flex items-center justify-center">
              <Lock className="w-7 h-7 text-indigo-400" />
            </div>
            <h1 className="text-xl font-semibold text-midnight-text-primary">Admin Access</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="ID"
              className="w-full h-12 px-4 bg-midnight-card border border-midnight-border rounded-xl text-midnight-text-primary placeholder:text-midnight-text-muted focus:outline-none focus:border-indigo-500"
            />
            <input
              type="password"
              value={loginPw}
              onChange={(e) => setLoginPw(e.target.value)}
              placeholder="Password"
              className="w-full h-12 px-4 bg-midnight-card border border-midnight-border rounded-xl text-midnight-text-primary placeholder:text-midnight-text-muted focus:outline-none focus:border-indigo-500"
            />
            {loginError && (
              <p className="text-red-400 text-sm text-center">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-midnight-bg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-midnight-bg/80 backdrop-blur-md border-b border-midnight-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 hover:bg-midnight-card rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-midnight-text-secondary" />
          </Link>
          <h1 className="text-lg font-semibold text-midnight-text-primary">Admin</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* 개발 모드 토글 */}
        <section className="bg-midnight-card border border-midnight-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Moon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="font-medium text-midnight-text-primary">개발 모드</h2>
                <p className="text-sm text-midnight-text-muted">
                  {devMode ? '시간 제한 없이 항상 열림' : '자정~새벽 4시에만 열림'}
                </p>
              </div>
            </div>
            <button
              onClick={handleDevModeToggle}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {devMode ? (
                <ToggleRight className="w-10 h-10" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-midnight-text-muted" />
              )}
            </button>
          </div>
        </section>

        {/* 통계 */}
        <section className="bg-midnight-card border border-midnight-border rounded-2xl p-5">
          <h2 className="font-medium text-midnight-text-primary mb-4">통계</h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={Users} label="전체 유저" value={stats?.users || 0} />
            <StatCard icon={FileText} label="전체 게시물" value={stats?.posts || 0} />
            <StatCard icon={MessageSquare} label="전체 댓글" value={stats?.comments || 0} />
            <StatCard icon={AlertTriangle} label="신고" value={stats?.reports || 0} color="red" />
          </div>
        </section>

        {/* 최근 신고 */}
        <section className="bg-midnight-card border border-midnight-border rounded-2xl p-5">
          <h2 className="font-medium text-midnight-text-primary mb-4">최근 신고</h2>
          {recentReports.length === 0 ? (
            <p className="text-sm text-midnight-text-muted text-center py-4">신고 내역이 없습니다</p>
          ) : (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between py-2 border-b border-midnight-border last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      report.target_type === 'post'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {report.target_type === 'post' ? '게시물' : '댓글'}
                    </span>
                    <span className="text-sm text-midnight-text-secondary">
                      {reasonLabels[report.reason] || report.reason}
                    </span>
                  </div>
                  <span className="text-xs text-midnight-text-muted">
                    {new Date(report.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

function StatCard({
  icon: Icon,
  label,
  value,
  color = 'indigo'
}: {
  icon: typeof Users;
  label: string;
  value: number;
  color?: 'indigo' | 'red';
}) {
  const colorClasses = {
    indigo: 'bg-indigo-500/20 text-indigo-400',
    red: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="bg-midnight-bg rounded-xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-midnight-text-primary">{value}</p>
        <p className="text-xs text-midnight-text-muted">{label}</p>
      </div>
    </div>
  );
}
