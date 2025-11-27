import React, { useState, useEffect } from 'react';
import { AppData, Campus, Achievement, Teacher } from '../types';
import { saveAppData, fileToBase64, resetToDefaults } from '../services/storage';
import { polishText } from '../services/gemini';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save, Plus, Trash, Wand2, RefreshCw, Home, Image as ImageIcon } from 'lucide-react';

interface AdminProps {
  data: AppData;
  onUpdate: () => void;
}

export const AdminDashboard: React.FC<AdminProps> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'config' | 'home' | 'campuses' | 'achievements' | 'faculty' | 'about'>('home');
  const [localData, setLocalData] = useState<AppData>(data);
  const [isSaving, setIsSaving] = useState(false);
  const [polishLoading, setPolishLoading] = useState<string | null>(null); // Stores the field ID being polished
  const navigate = useNavigate();

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleSave = async () => {
    setIsSaving(true);
    saveAppData(localData);
    // Simulate network delay
    setTimeout(() => {
      onUpdate();
      setIsSaving(false);
      alert('所有内容已同步更新至前台！');
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('youcai_token');
    navigate('/login');
  };

  // Generic text handler
  const updateField = (path: string, value: any) => {
    const newData = JSON.parse(JSON.stringify(localData));
    const parts = path.split('.');
    let current = newData;
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    setLocalData(newData);
  };

  // AI Polish Handler
  const handlePolish = async (path: string, context: string) => {
    setPolishLoading(path);
    // Get current value
    const parts = path.split('.');
    let value = localData as any;
    for (const part of parts) {
      value = value[part];
    }
    
    if (typeof value === 'string' && value.length > 0) {
      const polished = await polishText(value, context);
      updateField(path, polished);
    }
    setPolishLoading(null);
  };

  // Generic File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        updateField(path, base64);
      } catch (err) {
        alert("图片上传失败");
      }
    }
  };
  
  // Specific handler for array image uploads (append)
  const handleArrayImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
    if (e.target.files && e.target.files[0]) {
       try {
        const base64 = await fileToBase64(e.target.files[0]);
        // Resolve path to array
        const parts = path.split('.');
        let currentArr = localData as any;
        for (const part of parts) {
           currentArr = currentArr[part];
        }
        updateField(path, [...(currentArr || []), base64]);
      } catch (err) {
        alert("图片上传失败");
      }
    }
  };

  // ---- RENDERERS ----

  const renderConfig = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold border-b pb-2">基础设置</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">网站名称</label>
          <input 
            className="w-full border p-2 rounded" 
            value={localData.config.name} 
            onChange={e => updateField('config.name', e.target.value)} 
          />
        </div>
        <div>
           <label className="block text-sm font-medium mb-1">网站 Logo</label>
           <input type="file" onChange={e => handleFileUpload(e, 'config.logoUrl')} className="mb-2 text-sm" />
           <img src={localData.config.logoUrl} className="h-10 border" alt="preview" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">页脚版权文字</label>
          <input 
            className="w-full border p-2 rounded" 
            value={localData.config.footerText} 
            onChange={e => updateField('config.footerText', e.target.value)} 
          />
        </div>
        
        <h4 className="md:col-span-2 font-bold mt-4 border-t pt-4">管理员登录页设置</h4>
        <div className="md:col-span-2">
           <label className="block text-sm font-medium mb-2">背景图轮播 (支持多张)</label>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
              {localData.config.loginBackgroundUrls && localData.config.loginBackgroundUrls.map((url, i) => (
                <div key={i} className="relative group aspect-video">
                  <img src={url} className="w-full h-full object-cover rounded border" alt={`bg-${i}`} />
                  <button 
                    onClick={() => {
                       const newArr = localData.config.loginBackgroundUrls.filter((_, idx) => idx !== i);
                       updateField('config.loginBackgroundUrls', newArr);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-slate-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors aspect-video text-slate-400">
                <Plus size={24} />
                <span className="text-xs mt-1">添加背景图</span>
                <input type="file" className="hidden" onChange={e => handleArrayImageUpload(e, 'config.loginBackgroundUrls')} />
              </label>
           </div>
        </div>

        <h4 className="md:col-span-2 font-bold mt-4 border-t pt-4">联系方式</h4>
        <div>
          <label className="block text-sm font-medium mb-1">电话</label>
          <input className="w-full border p-2 rounded" value={localData.config.contact.phone} onChange={e => updateField('config.contact.phone', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">微信</label>
          <input className="w-full border p-2 rounded" value={localData.config.contact.wechat} onChange={e => updateField('config.contact.wechat', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">地址</label>
          <input className="w-full border p-2 rounded" value={localData.config.contact.address} onChange={e => updateField('config.contact.address', e.target.value)} />
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold border-b pb-2">首页内容</h3>
      <div>
        <label className="block text-sm font-medium mb-1">主标题</label>
        <div className="flex gap-2">
          <input className="w-full border p-2 rounded" value={localData.home.title} onChange={e => updateField('home.title', e.target.value)} />
          <button onClick={() => handlePolish('home.title', 'Main website heading')} className="bg-purple-100 text-purple-700 px-3 rounded hover:bg-purple-200" title="AI Polish">
             {polishLoading === 'home.title' ? <RefreshCw className="animate-spin" size={16}/> : <Wand2 size={16} />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">副标题</label>
        <div className="flex gap-2">
          <textarea className="w-full border p-2 rounded" value={localData.home.subtitle} onChange={e => updateField('home.subtitle', e.target.value)} />
          <button onClick={() => handlePolish('home.subtitle', 'Website sub-heading description')} className="bg-purple-100 text-purple-700 px-3 rounded hover:bg-purple-200 h-10">
            {polishLoading === 'home.subtitle' ? <RefreshCw className="animate-spin" size={16}/> : <Wand2 size={16} />}
          </button>
        </div>
      </div>
      
      {/* Home Banner Carousel Management */}
      <div>
         <label className="block text-sm font-medium mb-2">Banner 轮播图 (支持多张)</label>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-2">
            {(localData.home.imageUrls || []).map((url, i) => (
              <div key={i} className="relative group aspect-[16/5] md:aspect-video">
                <img src={url} className="w-full h-full object-cover rounded border" alt={`banner-${i}`} />
                <button 
                  onClick={() => {
                     const newArr = localData.home.imageUrls.filter((_, idx) => idx !== i);
                     updateField('home.imageUrls', newArr);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash size={12} />
                </button>
              </div>
            ))}
            <label className="border-2 border-dashed border-slate-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors aspect-[16/5] md:aspect-video text-slate-400">
              <Plus size={24} />
              <span className="text-xs mt-1">添加图片</span>
              <input type="file" className="hidden" onChange={e => handleArrayImageUpload(e, 'home.imageUrls')} />
            </label>
         </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">核心优势列表 (每行一个)</label>
        {localData.home.advantages.map((adv, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input 
              className="w-full border p-2 rounded" 
              value={adv} 
              onChange={e => {
                const newAdv = [...localData.home.advantages];
                newAdv[idx] = e.target.value;
                updateField('home.advantages', newAdv);
              }} 
            />
            <button 
              onClick={() => {
                 const newAdv = localData.home.advantages.filter((_, i) => i !== idx);
                 updateField('home.advantages', newAdv);
              }}
              className="text-red-500 hover:bg-red-50 p-2 rounded"
            ><Trash size={16}/></button>
          </div>
        ))}
        <button 
          onClick={() => updateField('home.advantages', [...localData.home.advantages, "新优势点"])}
          className="text-sm text-primary flex items-center mt-2"
        >
          <Plus size={14} className="mr-1"/> 添加优势
        </button>
      </div>
    </div>
  );

  const renderCampuses = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b pb-2">
         <h3 className="text-xl font-bold">校区管理</h3>
         <button 
           onClick={() => {
             const newCampus: Campus = { id: Date.now().toString(), name: "新校区", address: "地址", description: "描述", imageUrl: "https://via.placeholder.com/400", facilities: [] };
             updateField('campuses', [...localData.campuses, newCampus]);
           }}
           className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center"
         ><Plus size={14} className="mr-1" /> 新增校区</button>
      </div>
      {localData.campuses.map((campus, idx) => (
        <div key={campus.id} className="border p-4 rounded bg-slate-50 relative">
          <button 
            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            onClick={() => {
              if(confirm('确定删除该校区吗？')) {
                 const newArr = localData.campuses.filter((_, i) => i !== idx);
                 updateField('campuses', newArr);
              }
            }}
          ><Trash size={18} /></button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500">校区名称</label>
              <input className="w-full border p-2 rounded bg-white" value={campus.name} onChange={e => {
                const newArr = [...localData.campuses]; newArr[idx].name = e.target.value; updateField('campuses', newArr);
              }} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">地址</label>
              <input className="w-full border p-2 rounded bg-white" value={campus.address} onChange={e => {
                const newArr = [...localData.campuses]; newArr[idx].address = e.target.value; updateField('campuses', newArr);
              }} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500">介绍 (支持 AI 润色)</label>
              <div className="flex gap-2">
                <textarea className="w-full border p-2 rounded bg-white" rows={2} value={campus.description} onChange={e => {
                  const newArr = [...localData.campuses]; newArr[idx].description = e.target.value; updateField('campuses', newArr);
                }} />
                <button 
                  onClick={() => handlePolish(`campuses.${idx}.description`, 'Campus description highlighting environment')} 
                  className="bg-purple-100 text-purple-700 px-3 rounded hover:bg-purple-200 h-10"
                >
                  {polishLoading === `campuses.${idx}.description` ? <RefreshCw className="animate-spin" size={16}/> : <Wand2 size={16} />}
                </button>
              </div>
            </div>
             <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500">图片</label>
                <div className="flex items-center gap-4">
                  <img src={campus.imageUrl} className="h-16 w-24 object-cover rounded" />
                  <input type="file" onChange={e => handleFileUpload(e, `campuses.${idx}.imageUrl`)} />
                </div>
             </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b pb-2">
         <h3 className="text-xl font-bold">学员成果管理</h3>
         <button 
           onClick={() => {
             const newAch: Achievement = { 
               id: Date.now().toString(), 
               studentName: "姓名", 
               title: "录取院校/奖项", 
               description: "详细描述...", 
               category: "升学", 
               imageUrl: "https://via.placeholder.com/400?text=Student" 
             };
             updateField('achievements', [...localData.achievements, newAch]);
           }}
           className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center hover:bg-green-700 transition-colors"
         ><Plus size={14} className="mr-1" /> 新增成果</button>
      </div>
      
      {localData.achievements.map((ach, idx) => (
        <div key={ach.id} className="border p-4 rounded bg-slate-50 relative shadow-sm">
          <button 
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-white p-1 rounded-full shadow-sm"
            title="删除"
            onClick={() => {
              if(confirm('确定删除该记录吗？')) {
                 const newArr = localData.achievements.filter((_, i) => i !== idx);
                 updateField('achievements', newArr);
              }
            }}
          ><Trash size={18} /></button>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Image Upload Column */}
            <div className="md:col-span-3 flex flex-col items-center justify-center border-r border-slate-200 pr-4">
               <img src={ach.imageUrl} className="w-24 h-24 object-cover rounded-full mb-2 border shadow-sm" alt="preview" />
               <label className="cursor-pointer text-xs bg-white border border-slate-300 hover:bg-slate-100 px-2 py-1 rounded transition-colors">
                  更换照片
                  <input type="file" className="hidden" onChange={e => handleFileUpload(e, `achievements.${idx}.imageUrl`)} />
               </label>
            </div>

            {/* Content Column */}
            <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">学员姓名</label>
                  <input className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-primary focus:outline-none" value={ach.studentName} onChange={e => {
                    const newArr = [...localData.achievements]; newArr[idx].studentName = e.target.value; updateField('achievements', newArr);
                  }} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">类别</label>
                  <select 
                    className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                    value={ach.category}
                    onChange={e => {
                      const newArr = [...localData.achievements]; newArr[idx].category = e.target.value as any; updateField('achievements', newArr);
                    }}
                  >
                    <option value="升学">升学</option>
                    <option value="竞赛">竞赛</option>
                    <option value="提分">提分</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">录取院校 / 奖项名称</label>
                  <input className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-primary focus:outline-none" value={ach.title} onChange={e => {
                    const newArr = [...localData.achievements]; newArr[idx].title = e.target.value; updateField('achievements', newArr);
                  }} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                    <span>详细描述</span>
                    <button 
                      onClick={() => handlePolish(`achievements.${idx}.description`, 'Student achievement success story')} 
                      className="text-primary hover:text-blue-700 text-xs flex items-center"
                      disabled={!!polishLoading}
                    >
                      {polishLoading === `achievements.${idx}.description` ? <RefreshCw className="animate-spin mr-1" size={12}/> : <Wand2 size={12} className="mr-1" />}
                      AI 润色
                    </button>
                  </label>
                  <textarea className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-primary focus:outline-none" rows={3} value={ach.description} onChange={e => {
                    const newArr = [...localData.achievements]; newArr[idx].description = e.target.value; updateField('achievements', newArr);
                  }} />
                </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFaculty = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b pb-2">
         <h3 className="text-xl font-bold">师资队伍管理</h3>
         <button 
           onClick={() => {
             const newTeacher: Teacher = { 
               id: Date.now().toString(), 
               name: "教师姓名", 
               title: "高级讲师", 
               bio: "教师简介...", 
               yearsOfExperience: 1, 
               tags: ["标签1"], 
               imageUrl: "https://via.placeholder.com/200?text=Teacher" 
             };
             updateField('faculty', [...localData.faculty, newTeacher]);
           }}
           className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center hover:bg-green-700 transition-colors"
         ><Plus size={14} className="mr-1" /> 新增教师</button>
      </div>
      
      {localData.faculty.map((teacher, idx) => (
        <div key={teacher.id} className="border p-4 rounded bg-slate-50 relative shadow-sm">
          <button 
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-white p-1 rounded-full shadow-sm"
            title="删除"
            onClick={() => {
              if(confirm('确定删除该教师吗？')) {
                 const newArr = localData.faculty.filter((_, i) => i !== idx);
                 updateField('faculty', newArr);
              }
            }}
          ><Trash size={18} /></button>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
             {/* Image Upload Column */}
             <div className="md:col-span-3 flex flex-col items-center justify-start pt-2 border-r border-slate-200 pr-4">
               <div className="w-full aspect-[3/4] bg-slate-200 rounded overflow-hidden mb-2 shadow-sm relative group">
                 <img src={teacher.imageUrl} className="w-full h-full object-cover" alt="preview" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer text-white text-xs border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition-colors">
                      <input type="file" className="hidden" onChange={e => handleFileUpload(e, `faculty.${idx}.imageUrl`)} />
                      更换照片
                    </label>
                 </div>
               </div>
               <p className="text-xs text-slate-400">建议比例 3:4</p>
            </div>

            {/* Content Column */}
            <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">教师姓名</label>
                  <input className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-primary focus:outline-none" value={teacher.name} onChange={e => {
                    const newArr = [...localData.faculty]; newArr[idx].name = e.target.value; updateField('faculty', newArr);
                  }} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">职称 / 头衔</label>
                  <input className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-primary focus:outline-none" value={teacher.title} onChange={e => {
                    const newArr = [...localData.faculty]; newArr[idx].title = e.target.value; updateField('faculty', newArr);
                  }} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">教龄 (年)</label>
                  <input type="number" className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-primary focus:outline-none" value={teacher.yearsOfExperience} onChange={e => {
                    const newArr = [...localData.faculty]; newArr[idx].yearsOfExperience = Number(e.target.value); updateField('faculty', newArr);
                  }} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">标签 (用逗号分隔)</label>
                  <input 
                    className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-primary focus:outline-none" 
                    value={teacher.tags.join(', ')} 
                    placeholder="例如: 清华博士, 竞赛金牌教练"
                    onChange={e => {
                      const val = e.target.value;
                      // Split by Chinese or English comma
                      const tags = val.split(/[,，]/).map(t => t.trim()); 
                      const newArr = [...localData.faculty]; 
                      newArr[idx].tags = tags; 
                      updateField('faculty', newArr);
                    }} 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                    <span>个人简介</span>
                    <button 
                      onClick={() => handlePolish(`faculty.${idx}.bio`, 'Professional teacher biography, inspiring and authoritative')} 
                      className="text-primary hover:text-blue-700 text-xs flex items-center"
                      disabled={!!polishLoading}
                    >
                      {polishLoading === `faculty.${idx}.bio` ? <RefreshCw className="animate-spin mr-1" size={12}/> : <Wand2 size={12} className="mr-1" />}
                      AI 润色
                    </button>
                  </label>
                  <textarea className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-primary focus:outline-none" rows={4} value={teacher.bio} onChange={e => {
                    const newArr = [...localData.faculty]; newArr[idx].bio = e.target.value; updateField('faculty', newArr);
                  }} />
                </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-800 text-white flex flex-col flex-shrink-0">
        <div className="p-6 text-xl font-bold bg-slate-900">后台管理系统</div>
        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'home', label: '首页管理' },
            { id: 'campuses', label: '校区展示' },
            { id: 'achievements', label: '学员成果' },
            { id: 'faculty', label: '师资队伍' },
            { id: 'about', label: '关于我们' },
            { id: 'config', label: '全局配置' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full text-left px-4 py-3 rounded transition-colors ${
                activeTab === item.id ? 'bg-primary text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700 space-y-2">
           <button onClick={() => navigate('/')} className="flex items-center text-slate-400 hover:text-white w-full px-4 py-2">
             <Home size={16} className="mr-2" /> 返回主界面
           </button>
           <button onClick={handleLogout} className="flex items-center text-slate-400 hover:text-white w-full px-4 py-2">
             <LogOut size={16} className="mr-2" /> 退出登录
           </button>
           <button onClick={() => { if(confirm('确定重置所有数据为默认值吗？')) resetToDefaults(); }} className="flex items-center text-red-400 hover:text-red-300 w-full px-4 py-2 text-xs">
              重置数据
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === 'home' && '首页内容编辑'}
              {activeTab === 'campuses' && '校区信息管理'}
              {activeTab === 'achievements' && '学员成果管理'}
              {activeTab === 'faculty' && '教师团队管理'}
              {activeTab === 'about' && '关于我们编辑'}
              {activeTab === 'config' && '全局设置'}
            </h2>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className={`flex items-center px-6 py-2 rounded font-bold text-white transition-all ${
                isSaving ? 'bg-slate-400' : 'bg-green-600 hover:bg-green-700 shadow-md'
              }`}
            >
              <Save size={18} className="mr-2" />
              {isSaving ? '保存中...' : '发布更新'}
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'config' && renderConfig()}
            {activeTab === 'home' && renderHome()}
            {activeTab === 'campuses' && renderCampuses()}
            {activeTab === 'achievements' && renderAchievements()}
            {activeTab === 'faculty' && renderFaculty()}
            {activeTab === 'about' && (
               <div className="space-y-6">
                  <h3 className="text-xl font-bold border-b pb-2">关于我们</h3>
                  <label className="block text-sm font-medium">发展历程</label>
                  <textarea className="w-full border p-2 rounded" rows={4} value={localData.about.history} onChange={e => updateField('about.history', e.target.value)} />
                  <label className="block text-sm font-medium mt-4">办学理念</label>
                  <textarea className="w-full border p-2 rounded" rows={2} value={localData.about.philosophy} onChange={e => updateField('about.philosophy', e.target.value)} />
                  <label className="block text-sm font-medium mt-4">价值观</label>
                  <input className="w-full border p-2 rounded" value={localData.about.values} onChange={e => updateField('about.values', e.target.value)} />
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};