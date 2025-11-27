import React, { useState, useEffect } from 'react';
import { AppData } from '../types';
import { MapPin, Trophy, Users, Star, CheckCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageProps {
  data: AppData;
}

// --- Home Page ---
export const HomePage: React.FC<PageProps> = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = data.home.imageUrls || []; // Fallback if undefined during migration

  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[400px] md:h-[600px] w-full overflow-hidden bg-slate-900">
        {images.length > 0 ? (
          images.map((url, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={url} 
                alt={`Hero Slide ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-slate-800" />
        )}
        
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4 z-10">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up">
              {data.home.title}
            </h1>
            <p className="text-lg md:text-2xl text-slate-100 mb-8 max-w-2xl mx-auto">
              {data.home.subtitle}
            </p>
            <Link to="/contact" className="bg-secondary hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 inline-block">
              预约试听
            </Link>
          </div>
        </div>
        
        {/* Carousel Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Advantages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">核心优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.home.advantages.map((adv, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                <CheckCircle size={40} className="text-primary mb-4" />
                <h3 className="text-lg font-medium text-slate-800">{adv}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sections Preview */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white p-8 rounded-lg shadow-sm">
                <Users size={32} className="text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-2">名师团队</h3>
                <p className="text-slate-600 mb-4 line-clamp-2">汇聚省内优秀教师资源...</p>
                <Link to="/faculty" className="text-primary hover:underline">查看更多 &rarr;</Link>
             </div>
             <div className="bg-white p-8 rounded-lg shadow-sm">
                <Trophy size={32} className="text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-2">辉煌战绩</h3>
                <p className="text-slate-600 mb-4 line-clamp-2">历年高考、竞赛成绩斐然...</p>
                <Link to="/achievements" className="text-primary hover:underline">查看更多 &rarr;</Link>
             </div>
             <div className="bg-white p-8 rounded-lg shadow-sm">
                <MapPin size={32} className="text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-2">就近入学</h3>
                <p className="text-slate-600 mb-4 line-clamp-2">多校区覆盖，环境舒适...</p>
                <Link to="/campuses" className="text-primary hover:underline">查看更多 &rarr;</Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Campuses Page ---
export const CampusesPage: React.FC<PageProps> = ({ data }) => {
  return (
    <div className="py-12 bg-slate-50 min-h-[80vh]">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-12 text-slate-800">校区环境</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {data.campuses.map(campus => (
            <div key={campus.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div className="h-64 overflow-hidden">
                <img src={campus.imageUrl} alt={campus.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{campus.name}</h2>
                <div className="flex items-start text-slate-600 mb-4">
                  <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                  <span>{campus.address}</span>
                </div>
                <p className="text-slate-600 mb-6">{campus.description}</p>
                <div className="flex flex-wrap gap-2">
                  {campus.facilities.map((fac, i) => (
                    <span key={i} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                      {fac}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Achievements Page ---
export const AchievementsPage: React.FC<PageProps> = ({ data }) => {
  return (
    <div className="py-12 bg-white min-h-[80vh]">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-4 text-slate-800">学员成果</h1>
        <p className="text-center text-slate-500 mb-12">每一份成绩都是努力的见证</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.achievements.map(ach => (
            <div key={ach.id} className="bg-slate-50 border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
               <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 mr-4">
                    <img src={ach.imageUrl} alt={ach.studentName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{ach.studentName}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${ach.category === '升学' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {ach.category}
                    </span>
                  </div>
               </div>
               <h4 className="text-primary font-bold mb-2">{ach.title}</h4>
               <p className="text-sm text-slate-600">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Faculty Page ---
export const FacultyPage: React.FC<PageProps> = ({ data }) => {
  return (
    <div className="py-12 bg-slate-50 min-h-[80vh]">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-12 text-slate-800">名师风采</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.faculty.map(teacher => (
            <div key={teacher.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col">
              <div className="h-48 overflow-hidden bg-slate-200 relative group">
                <img src={teacher.imageUrl} alt={teacher.name} className="w-full h-full object-cover object-top" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                   <h3 className="text-white text-xl font-bold">{teacher.name}</h3>
                   <p className="text-slate-200 text-sm">{teacher.title}</p>
                </div>
              </div>
              <div className="p-6 flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                   <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">教龄 {teacher.yearsOfExperience} 年</span>
                   {teacher.tags.map((tag, i) => (
                     <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">{tag}</span>
                   ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{teacher.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- About Page ---
export const AboutPage: React.FC<PageProps> = ({ data }) => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-slate-800">关于我们</h1>
        
        <div className="space-y-12">
          <section>
             <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
               <Star className="mr-2" /> 发展历程
             </h2>
             <p className="text-lg text-slate-700 leading-relaxed">{data.about.history}</p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-xl">
               <h2 className="text-xl font-bold text-primary mb-4">办学理念</h2>
               <p className="text-slate-700">{data.about.philosophy}</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl">
               <h2 className="text-xl font-bold text-primary mb-4">核心价值观</h2>
               <p className="text-slate-700">{data.about.values}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">办学资质</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.about.certImageUrls.map((url, i) => (
                <div key={i} className="border p-2 rounded-lg shadow-sm">
                   <img src={url} alt={`Cert ${i}`} className="w-full h-auto" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- Contact Page ---
export const ContactPage: React.FC<PageProps> = ({ data }) => {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNumber = '19944187488';
    const body = `【官网留言】\n姓名：${formState.name}\n电话：${formState.phone}\n内容：${formState.message}`;
    
    // Check for iOS to use '&' separator, otherwise '?'
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isIOS ? '&' : '?';
    
    // Construct the sms URL
    const smsUrl = `sms:${targetNumber}${separator}body=${encodeURIComponent(body)}`;
    
    // Open the default SMS client
    window.location.href = smsUrl;
    
    alert("正在调起短信客户端发送您的留言...");
  };

  return (
    <div className="py-12 bg-slate-50 min-h-[80vh]">
       <div className="container mx-auto px-4 max-w-5xl">
         <h1 className="text-3xl font-bold text-center mb-12 text-slate-800">联系我们</h1>
         
         <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 bg-primary text-white">
              <h2 className="text-2xl font-bold mb-6">联系方式</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                   <Phone className="mr-4 mt-1" />
                   <div>
                     <p className="text-xs text-blue-200 uppercase tracking-wider">电话</p>
                     <p className="text-lg font-medium">{data.config.contact.phone}</p>
                   </div>
                </div>
                <div className="flex items-start">
                   <MapPin className="mr-4 mt-1" />
                   <div>
                     <p className="text-xs text-blue-200 uppercase tracking-wider">地址</p>
                     <p className="text-lg font-medium">{data.config.contact.address}</p>
                   </div>
                </div>
                <div className="flex items-start">
                   <Users className="mr-4 mt-1" />
                   <div>
                     <p className="text-xs text-blue-200 uppercase tracking-wider">微信客服</p>
                     <p className="text-lg font-medium">{data.config.contact.wechat}</p>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 md:p-12">
               <h2 className="text-2xl font-bold text-slate-800 mb-6">在线留言</h2>
               <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">您的姓名</label>
                   <input 
                      type="text" 
                      value={formState.name}
                      onChange={e => setFormState({...formState, name: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                      required 
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">联系电话</label>
                   <input 
                      type="tel" 
                      value={formState.phone}
                      onChange={e => setFormState({...formState, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                      required 
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">留言内容</label>
                   <textarea 
                      rows={4} 
                      value={formState.message}
                      onChange={e => setFormState({...formState, message: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      required
                   ></textarea>
                 </div>
                 <button type="submit" className="w-full bg-secondary hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors">
                   提交留言
                 </button>
               </form>
            </div>
         </div>
       </div>
    </div>
  );
};
