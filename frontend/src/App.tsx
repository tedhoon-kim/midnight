import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useMidnightAccess } from './hooks/useMidnightAccess';
import { ClosedLanding } from './pages/ClosedLanding';
import { CommunityMain } from './pages/CommunityMain';
import { PostDetail } from './pages/PostDetail';
import { Compose } from './pages/Compose';
import { Login } from './pages/Login';
import { AuthCallback } from './pages/AuthCallback';
import { MyProfile } from './pages/MyProfile';
import { Admin } from './pages/Admin';
import { NotFound } from './pages/NotFound';
import { ServerError } from './pages/ServerError';
import { Spinner } from './components/ui/Spinner';

// 인증 필요한 라우트 보호
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { isOpen } = useMidnightAccess();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-midnight-bg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // 로그인 안됨 → 로그인 페이지로
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 새벽 시간 아님 → 랜딩 페이지로
  if (!isOpen) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// 시간 기반 라우트 (로그인 불필요, 시간만 체크)
function MidnightRoute({ children }: { children: React.ReactNode }) {
  const { isOpen } = useMidnightAccess();

  if (!isOpen) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isOpen } = useMidnightAccess();

  return (
    <Routes>
      {/* Landing - 시간에 따라 다른 페이지 표시 */}
      <Route 
        path="/" 
        element={isOpen ? <Navigate to="/community" replace /> : <ClosedLanding />} 
      />
      
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Main Community (새벽 시간에만 접근 가능) */}
      <Route 
        path="/community" 
        element={
          <MidnightRoute>
            <CommunityMain />
          </MidnightRoute>
        } 
      />
      
      {/* Post (새벽 시간에만 접근 가능) */}
      <Route 
        path="/post/:id" 
        element={
          <MidnightRoute>
            <PostDetail />
          </MidnightRoute>
        } 
      />
      <Route 
        path="/compose" 
        element={
          <ProtectedRoute>
            <Compose />
          </ProtectedRoute>
        } 
      />
      
      {/* Profile (로그인 필요) */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin */}
      <Route path="/tedhoon" element={<Admin />} />

      {/* Error Pages */}
      <Route path="/error" element={<ServerError />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
