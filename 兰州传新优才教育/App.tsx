import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PublicLayout } from './components/Layout';
import { AdminDashboard } from './pages/Admin';
import { HomePage, CampusesPage, AchievementsPage, FacultyPage, AboutPage, ContactPage } from './pages/PublicPages';
import { getAppData } from './services/storage';
import { AppData, SiteConfig } from './types';

// Simple Login Component
const Login = ({ config }: { config: SiteConfig }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Background Carousel Effect
  useEffect(() => {
    if (!config.loginBackgroundUrls || config.loginBackgroundUrls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % config.loginBackgroundUrls.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [config.loginBackgroundUrls]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials as requested in prompt
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('youcai_token', 'demo-token');
      navigate('/admin');
    } else {
      setError('账号或密码错误');
    }
  };

  const bgImages = config.loginBackgroundUrls && config.loginBackgroundUrls.length > 0 
    ? config.loginBackgroundUrls 
    : ['https://picsum.photos/1920/1080?random=99']; // Fallback

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Carousel Layer */}
      {bgImages.map((url, index) => (
        <div 
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${url})` }}
        />
      ))}
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* Login Form */}
      <div className="relative z-10 bg-white/95 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-sm border border-white/20">
        <div className="text-center mb-6">
           {config.logoUrl.startsWith('http') || config.logoUrl.startsWith('data') ? (
             <img src={config.logoUrl} alt="Logo" className="h-10 mx-auto mb-2" />
           ) : (
             <span className="text-2xl font-bold text-primary">{config.name}</span>
           )}
           <h2 className="text-xl font-bold text-slate-800">管理员登录</h2>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">账号</label>
            <input 
              type="text" 
              className="mt-1 block w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="请输入管理员账号"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">密码</label>
            <input 
              type="password" 
              className="mt-1 block w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="请输入管理员密码"
            />
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
          <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-blue-800 transition-colors font-medium shadow-md hover:shadow-lg">
            立即登录
          </button>
        </form>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 w-full border border-slate-300 text-slate-600 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm"
        >
          返回主界面
        </button>
      </div>
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('youcai_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  const [data, setData] = useState<AppData>(getAppData());

  const refreshData = () => {
    setData(getAppData());
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <PublicLayout config={data.config}><HomePage data={data} /></PublicLayout>
      } />
      <Route path="/campuses" element={
        <PublicLayout config={data.config}><CampusesPage data={data} /></PublicLayout>
      } />
      <Route path="/achievements" element={
        <PublicLayout config={data.config}><AchievementsPage data={data} /></PublicLayout>
      } />
      <Route path="/faculty" element={
        <PublicLayout config={data.config}><FacultyPage data={data} /></PublicLayout>
      } />
      <Route path="/about" element={
        <PublicLayout config={data.config}><AboutPage data={data} /></PublicLayout>
      } />
      <Route path="/contact" element={
        <PublicLayout config={data.config}><ContactPage data={data} /></PublicLayout>
      } />
      
      {/* Admin Routes */}
      <Route path="/login" element={<Login config={data.config} />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminDashboard data={data} onUpdate={refreshData} />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;