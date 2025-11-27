import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SiteConfig } from '../types';
import { Menu, X, Phone, MapPin, User as UserIcon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  config: SiteConfig;
}

export const PublicLayout: React.FC<LayoutProps> = ({ children, config }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: '首页', path: '/' },
    { name: '校区环境', path: '/campuses' },
    { name: '学员成果', path: '/achievements' },
    { name: '师资队伍', path: '/faculty' },
    { name: '关于我们', path: '/about' },
    { name: '联系我们', path: '/contact' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-primary text-white text-sm py-2 px-4 hidden md:flex justify-between items-center">
        <div className="flex space-x-6">
          <span className="flex items-center"><Phone size={14} className="mr-2" /> 咨询热线: {config.contact.phone}</span>
          <span className="flex items-center"><MapPin size={14} className="mr-2" /> {config.contact.address}</span>
        </div>
        <button 
          onClick={() => navigate('/admin')}
          className="flex items-center hover:text-secondary transition-colors"
        >
          <UserIcon size={14} className="mr-1" /> 管理员登录
        </button>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              {config.logoUrl.startsWith('http') || config.logoUrl.startsWith('data') ? (
                 <img src={config.logoUrl} alt={config.name} className="h-10 md:h-12 w-auto object-contain" />
              ) : (
                <span className="text-2xl font-bold text-primary">{config.name}</span>
              )}
               <span className="ml-3 text-xl font-bold text-primary hidden lg:block">{config.name}</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg font-medium transition-colors hover:text-primary ${
                    location.pathname === link.path ? 'text-primary border-b-2 border-primary' : 'text-slate-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-700 hover:text-primary p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-50 border-t border-slate-200">
            <div className="flex flex-col py-4 px-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-medium ${
                     location.pathname === link.path ? 'text-primary' : 'text-slate-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-slate-300" />
              <button 
                onClick={() => navigate('/admin')}
                className="text-left text-sm text-slate-500 flex items-center pt-2"
              >
                <UserIcon size={14} className="mr-2" /> 管理员入口
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">{config.name}</h3>
            <p className="text-sm leading-relaxed mb-4">
              专注中小学教育，用心成就每一个孩子的梦想。
            </p>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">联系方式</h3>
            <ul className="space-y-2 text-sm">
              <li>电话：{config.contact.phone}</li>
              <li>微信：{config.contact.wechat}</li>
              <li>邮箱：{config.contact.email}</li>
              <li>地址：{config.contact.address}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">快捷导航</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/" className="hover:text-white">首页</Link>
              <Link to="/campuses" className="hover:text-white">校区环境</Link>
              <Link to="/achievements" className="hover:text-white">学员成果</Link>
              <Link to="/faculty" className="hover:text-white">师资队伍</Link>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-700 text-center text-xs text-slate-500">
          <p>{config.footerText}</p>
        </div>
      </footer>
    </div>
  );
};