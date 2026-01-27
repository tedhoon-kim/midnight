import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { ClosedLanding } from './pages/ClosedLanding';
import { CommunityMain } from './pages/CommunityMain';
import { PostDetail } from './pages/PostDetail';
import { Compose } from './pages/Compose';
import { Login } from './pages/Login';
import { MyProfile } from './pages/MyProfile';
import { NotFound } from './pages/NotFound';
import { ServerError } from './pages/ServerError';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Landing (Closed state) */}
          <Route path="/" element={<ClosedLanding />} />
          
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          
          {/* Main Community */}
          <Route path="/community" element={<CommunityMain />} />
          
          {/* Post */}
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/compose" element={<Compose />} />
          
          {/* Profile */}
          <Route path="/profile" element={<MyProfile />} />
          
          {/* Error Pages */}
          <Route path="/error" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
