import { useState, useCallback, useRef, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { 
  LayoutDashboard, FileText, Activity, Database, Video, User, UploadCloud 
} from 'lucide-react';

// --- 1. المحرك (Hook) لربط البيانات والأنيمي ---
const useDomoAvatar = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>("/anime-video.mp4"); // القيمة الافتراضية للفيديو بتاعك
  const [isGenerating, setIsGenerating] = useState(false);
  const [importedData, setImportedData] = useState<any>(null);
  const [isDataVisible, setIsDataVisible] = useState(true);

  const toggleDataView = useCallback(() => setIsDataVisible(prev => !prev), []);

  return {
    videoUrl, isGenerating, isDataVisible, toggleDataView, 
    importedData, setImportedData
  };
};

// --- 2. الصفحة الأساسية (Dashboard) ---
const Index = () => {
  const { 
    videoUrl, isGenerating, isDataVisible, toggleDataView, 
    importedData, setImportedData 
  } = useDomoAvatar();

  // حساب الإحصائيات (KPIs) بناءً على ملف الـ CSV المرفوع
  const stats = useMemo(() => {
    if (!importedData) return { rows: 0, cols: 0, name: 'No File' };
    return {
      rows: importedData.rows?.length || 0,
      cols: importedData.headers?.length || 0,
      name: importedData.name || 'Untitled Dataset'
    };
  }, [importedData]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <LayoutDashboard size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Talking Anime AI Dashboard</h1>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all">
          <UploadCloud size={18} />
          <span>Upload CSV</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        
        {/* Row 1: Avatar & KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* كرت الأنيمي المتحدث */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="relative w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden mb-4 border-4 border-slate-50 shadow-inner">
              {videoUrl ? (
                <video src={videoUrl} autoPlay loop muted className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Video size={48} className="mb-2 opacity-20" />
                  <p>Waiting for Avatar...</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mb-2">
              <img src="/avatar1.jpg" alt="AV1" className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-sm" />
              <img src="/avatar2.jpg" alt="AV2" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              <img src="/avatar3.jpg" alt="AV3" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 italic">"Ready to analyze your data, Mohamed!"</h2>
          </div>

          {/* كروت الإحصائيات (KPIs) */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex flex-col justify-between">
              <div className="bg-blue-500 w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200">
                <Database size={20} />
              </div>
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Rows</p>
                <h3 className="text-3xl font-bold text-blue-900">{stats.rows}</h3>
              </div>
            </div>
            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex flex-col justify-between">
              <div className="bg-indigo-500 w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-200">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-indigo-600 text-sm font-medium">Columns Detected</p>
                <h3 className="text-3xl font-bold text-indigo-900">{stats.cols}</h3>
              </div>
            </div>
            <div className="col-span-2 bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4">
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Active Project</p>
                <h4 className="text-lg font-semibold text-slate-800">{stats.name}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-slate-700 font-bold mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              Data Distribution
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={importedData?.rows?.slice(0, 6) || [{name: 'A', v: 10}, {name: 'B', v: 20}]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="v" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-slate-700 font-bold mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
              Trend Analysis
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={importedData?.rows?.slice(0, 6) || [{name: 'A', v: 5}, {name: 'B', v: 25}]}>
                  <defs>
                    <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorV)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;