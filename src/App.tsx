import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Instagram, 
  Youtube, 
  Mail, 
  ChevronRight, 
  LayoutDashboard, 
  Settings, 
  Image as ImageIcon, 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  LogOut,
  Menu,
  X,
  ExternalLink,
  Monitor,
  Smartphone,
  Palette,
  Stethoscope,
  Building2,
  GraduationCap,
  Download,
  FileDown
} from 'lucide-react';
import { SiteSettings, Portfolio, Post } from './types';

// --- Components ---

const Navbar = ({ onAdminClick, isAdmin }: { onAdminClick: () => void, isAdmin: boolean }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    if (isAdmin) onAdminClick(); // Exit admin mode if clicking a nav link
    setIsMobileMenuOpen(false);
    
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
          <div className="w-8 h-8 bg-[#0A5C36] rounded-sm flex items-center justify-center text-xs">01</div>
          <span>ZERO ONE</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <button onClick={() => scrollTo('home')} className="hover:text-white transition-colors">홈</button>
          <button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">서비스</button>
          <button onClick={() => scrollTo('portfolio')} className="hover:text-white transition-colors">포트폴리오</button>
          <button onClick={() => scrollTo('contact')} className="hover:text-white transition-colors">문의하기</button>
          <button 
            onClick={onAdminClick}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all"
          >
            {isAdmin ? <LogOut size={16} /> : <LayoutDashboard size={16} />}
            {isAdmin ? '나가기' : '관리자'}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={onAdminClick}
            className="p-2 bg-white/5 rounded-full border border-white/10"
          >
            {isAdmin ? <LogOut size={18} /> : <LayoutDashboard size={18} />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6 text-lg font-medium">
              <button onClick={() => scrollTo('home')} className="text-left hover:text-[#0A5C36] transition-colors">홈</button>
              <button onClick={() => scrollTo('services')} className="text-left hover:text-[#0A5C36] transition-colors">서비스</button>
              <button onClick={() => scrollTo('portfolio')} className="text-left hover:text-[#0A5C36] transition-colors">포트폴리오</button>
              <button onClick={() => scrollTo('contact')} className="text-left hover:text-[#0A5C36] transition-colors">문의하기</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ settings }: { settings: SiteSettings }) => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden">
    {/* Background with cinematic overlay and thumbnail grid */}
    <div className="absolute inset-0 z-0">
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 p-2 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="aspect-video bg-white/5 rounded-lg overflow-hidden border border-white/5">
            <img 
              src={`https://picsum.photos/seed/hospital-${i}/400/225`} 
              className="w-full h-full object-cover"
              alt="Hospital Thumbnail"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)]" />
      
      {/* Viewfinder Overlay */}
      <div className="absolute inset-10 border border-white/10 pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#0A5C36]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#0A5C36]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#0A5C36]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#0A5C36]" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">REC 00:00:01:24</span>
        </div>
      </div>
    </div>

    <div className="relative z-10 text-center px-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[#0A5C36] text-[10px] font-bold tracking-[0.4em] mb-8 uppercase"
        >
          <div className="w-1.5 h-1.5 bg-[#0A5C36] rounded-full shadow-[0_0_10px_#0A5C36]" />
          Zeroone Production
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 leading-[1.1] tracking-tighter">
          {settings.hero_title.split('\n').map((text, i) => (
            <span key={i} className={i === 1 ? "block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20" : "block"}>
              {text.trim()}
            </span>
          ))}
        </h1>
        
        <p className="text-base md:text-xl text-white/40 mb-12 max-w-3xl mx-auto font-light leading-relaxed tracking-tight">
          {settings.hero_subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-10 py-5 bg-[#0A5C36] hover:bg-[#0c7042] text-white font-bold rounded-full transition-all flex items-center justify-center gap-3 group shadow-[0_10px_30px_rgba(10,92,54,0.3)]"
          >
            프로젝트 시작하기 <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md rounded-full transition-all font-bold"
          >
            포트폴리오 탐색
          </button>
        </div>
      </motion.div>
    </div>

    {/* Scroll Indicator */}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
    >
      <span className="text-[10px] font-bold tracking-[0.5em] text-white/20 uppercase">Scroll</span>
      <div className="w-[1px] h-12 bg-gradient-to-b from-[#0A5C36] to-transparent" />
    </motion.div>
  </section>
);

const DownloadSection = () => (
  <section className="py-20 px-6 bg-[#050505] border-t border-white/5">
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-[#0A5C36]/20 to-transparent border border-white/10 rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative group">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#0A5C36]/10 rounded-full blur-[100px] group-hover:bg-[#0A5C36]/20 transition-all duration-700" />
        
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A5C36]/10 rounded-full text-[#0A5C36] text-[10px] font-bold tracking-widest uppercase mb-6">
            <FileDown size={14} /> Company Profile
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            제로원프로덕션의<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A5C36] to-emerald-400">회사소개서</span>를 확인해보세요
          </h2>
          <p className="text-white/40 text-lg max-w-xl mb-10 leading-relaxed">
            우리의 제작 프로세스, 주요 사업 분야, 그리고 다양한 포트폴리오가 담긴 상세 소개서를 다운로드 받으실 수 있습니다.
          </p>
          <a 
            href="/ZERONE_Company_Profile.pdf" 
            download="제로원프로덕션_회사소개서.pdf"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#0A5C36] hover:bg-[#0c7042] text-white font-bold rounded-full transition-all shadow-[0_10px_30px_rgba(10,92,54,0.3)] group"
          >
            회사소개서 다운로드 <Download size={20} className="group-hover:translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="relative z-10 w-full md:w-80 aspect-[3/4] bg-white rounded-2xl overflow-hidden shadow-2xl transform rotate-3 group-hover:rotate-0 transition-all duration-700 flex flex-col items-center justify-center p-12">
          <div className="text-[#5A5A9E] font-bold text-5xl tracking-tighter mb-2">ZERONE</div>
          <div className="text-[#5A5A9E]/60 text-sm tracking-[0.3em] uppercase">Production</div>
          <div className="mt-12 w-12 h-[1px] bg-[#5A5A9E]/20" />
          <div className="mt-4 text-[10px] font-bold tracking-widest text-[#5A5A9E]/40 uppercase">Company Profile</div>
          
          <div className="absolute bottom-6 right-6">
            <div className="w-10 h-10 bg-[#5A5A9E]/10 rounded-full flex items-center justify-center">
              <FileDown size={18} className="text-[#5A5A9E]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PortfolioGrid = ({ portfolios }: { portfolios: Portfolio[] }) => {
  return (
    <section id="portfolio" className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tighter">PORTFOLIO</h2>
          <p className="text-white/50">우리의 감각으로 탄생한 결과물들입니다.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolios.slice(0, 6).map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
              onClick={() => window.open(item.video_url, '_blank')}
            >
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-white/5">
                <img 
                  src={item.thumbnail} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={item.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#0A5C36] rounded-full flex items-center justify-center">
                    <Play fill="white" size={24} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSection = ({ settings }: { settings: SiteSettings }) => (
  <section id="contact" className="py-32 px-6 bg-black">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
      {/* Left Side: Text & Info */}
      <div className="lg:w-5/12 space-y-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            프로젝트를 함께<br />시작해볼까요?
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">
            당신의 아이디어가 제로원프로덕션을 만나면 현실이 됩니다.<br />
            가벼운 문의라도 언제든 환영합니다.
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-[#0A5C36]/20 border border-[#0A5C36]/30 flex items-center justify-center text-[#0A5C36]">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Email</p>
              <p className="text-lg font-medium">{settings.contact_email}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-[#0A5C36]/20 border border-[#0A5C36]/30 flex items-center justify-center text-[#0A5C36]">
              <Smartphone size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Phone</p>
              <p className="text-lg font-medium">{settings.contact_phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form Card */}
      <div className="lg:w-7/12">
        <div className="p-8 md:p-12 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-sm">
          <form 
            action="https://formspree.io/f/mojkjdwq" 
            method="POST"
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-white/40 ml-1">이름</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="홍길동"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#0A5C36] outline-none transition-all placeholder:text-white/10"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-white/40 ml-1">연락처</label>
                <input 
                  type="text" 
                  name="phone"
                  required
                  placeholder="010-0000-0000"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#0A5C36] outline-none transition-all placeholder:text-white/10"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-white/40 ml-1">이메일</label>
              <input 
                type="email" 
                name="email"
                required
                placeholder="example@email.com"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#0A5C36] outline-none transition-all placeholder:text-white/10"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-white/40 ml-1">프로젝트 내용</label>
              <textarea 
                rows={4}
                name="message"
                required
                placeholder="어떤 프로젝트를 구상 중이신가요?"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#0A5C36] outline-none transition-all resize-none placeholder:text-white/10"
              />
            </div>
            <button type="submit" className="w-full py-6 bg-[#0A5C36] hover:bg-[#0c7042] text-white font-bold rounded-2xl transition-all shadow-[0_20px_40px_rgba(10,92,54,0.2)] text-lg">
              문의 보내기
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

const Footer = ({ settings }: { settings: SiteSettings }) => (
  <footer className="py-20 px-6 border-t border-white/10">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
      <div>
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-[#0A5C36] rounded-sm flex items-center justify-center text-xs text-white">01</div>
          <span>ZERO ONE</span>
        </div>
        <p className="text-white/40 max-w-sm mb-8">
          우리는 단순한 영상 제작을 넘어, 브랜드의 본질을 담아내는 시각적 예술을 지향합니다.
        </p>
        <div className="flex gap-4">
          <a href={settings.youtube_url} target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0A5C36] transition-colors">
            <Youtube size={20} />
          </a>
          <a href={settings.instagram_url} target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0A5C36] transition-colors">
            <Instagram size={20} />
          </a>
          <a href={`mailto:${settings.contact_email}`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0A5C36] transition-colors">
            <Mail size={20} />
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-16">
        <div>
          <h4 className="font-bold mb-6 text-sm tracking-widest">CONTACT</h4>
          <ul className="space-y-4 text-sm text-white/40">
            <li>{settings.contact_email}</li>
            <li>{settings.contact_phone}</li>
            <li>{settings.contact_address}</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-[10px] text-white/20 tracking-widest">
      © 2024 ZERO ONE PRODUCTION. ALL RIGHTS RESERVED.
    </div>
  </footer>
);

// --- Admin Components ---

const getYoutubeThumbnail = (url: string) => {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
  }
  return 'https://picsum.photos/seed/video/800/450';
};

const AdminDashboard = ({ 
  settings, 
  portfolios, 
  posts, 
  onUpdateSettings,
  onAddPortfolio,
  onDeletePortfolio,
  onUpdatePortfolio,
  onAddPost,
  onDeletePost
}: { 
  settings: SiteSettings, 
  portfolios: Portfolio[], 
  posts: Post[],
  onUpdateSettings: (s: Partial<SiteSettings>) => void,
  onAddPortfolio: (p: Partial<Portfolio>) => void,
  onDeletePortfolio: (id: number) => void,
  onUpdatePortfolio: (id: number, p: Partial<Portfolio>) => void,
  onAddPost: (p: Partial<Post>) => void,
  onDeletePost: (id: number) => void
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'portfolio' | 'news'>('general');
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
  };

  const handlePortfolioLinkChange = (id: number, url: string) => {
    const thumbnail = getYoutubeThumbnail(url);
    onUpdatePortfolio(id, { video_url: url, thumbnail });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 space-y-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'general' ? 'bg-[#0A5C36] text-white' : 'hover:bg-white/5 text-white/50'}`}
          >
            <Settings size={20} />
            <span className="font-bold">기본 설정</span>
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'portfolio' ? 'bg-[#0A5C36] text-white' : 'hover:bg-white/5 text-white/50'}`}
          >
            <ImageIcon size={20} />
            <span className="font-bold">포트폴리오 관리</span>
          </button>
          <button 
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'news' ? 'bg-[#0A5C36] text-white' : 'hover:bg-white/5 text-white/50'}`}
          >
            <FileText size={20} />
            <span className="font-bold">게시글 관리</span>
          </button>
        </aside>

        {/* Content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div 
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold">기본 설정</h2>
                  <button 
                    onClick={handleSaveSettings}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0A5C36] rounded-full font-bold hover:bg-[#0c7042] transition-all"
                  >
                    <Save size={18} /> 저장하기
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">사이트 이름</label>
                    <input 
                      type="text" 
                      value={localSettings.site_name}
                      onChange={e => setLocalSettings({...localSettings, site_name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">포인트 컬러</label>
                    <div className="flex gap-4">
                      <input 
                        type="color" 
                        value={localSettings.primary_color}
                        onChange={e => setLocalSettings({...localSettings, primary_color: e.target.value})}
                        className="w-12 h-12 bg-transparent border-none outline-none cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={localSettings.primary_color}
                        onChange={e => setLocalSettings({...localSettings, primary_color: e.target.value})}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">메인 타이틀 (Hero Title)</label>
                    <textarea 
                      rows={2}
                      value={localSettings.hero_title}
                      onChange={e => setLocalSettings({...localSettings, hero_title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">서브 타이틀 (Hero Subtitle)</label>
                    <textarea 
                      rows={2}
                      value={localSettings.hero_subtitle}
                      onChange={e => setLocalSettings({...localSettings, hero_subtitle: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">문의 이메일</label>
                    <input 
                      type="email" 
                      value={localSettings.contact_email}
                      onChange={e => setLocalSettings({...localSettings, contact_email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">문의 연락처</label>
                    <input 
                      type="text" 
                      value={localSettings.contact_phone}
                      onChange={e => setLocalSettings({...localSettings, contact_phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">문의 주소</label>
                    <input 
                      type="text" 
                      value={localSettings.contact_address}
                      onChange={e => setLocalSettings({...localSettings, contact_address: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">유튜브 URL</label>
                    <input 
                      type="text" 
                      value={localSettings.youtube_url}
                      onChange={e => setLocalSettings({...localSettings, youtube_url: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'portfolio' && (
              <motion.div 
                key="portfolio"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold">포트폴리오 관리</h2>
                  <button 
                    onClick={() => onAddPortfolio({
                      title: '',
                      description: '',
                      thumbnail: 'https://picsum.photos/seed/new/800/450',
                      video_url: '',
                      category: ''
                    })}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0A5C36] rounded-full font-bold hover:bg-[#0c7042] transition-all"
                  >
                    <Plus size={18} /> 추가하기
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {portfolios.map(item => (
                    <div key={item.id} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-6">
                        <img src={item.thumbnail} className="w-48 aspect-video object-cover rounded-xl" alt="" referrerPolicy="no-referrer" />
                        <div className="flex-1 space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">유튜브 링크 (자동 썸네일 추출)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={item.video_url}
                                onChange={e => handlePortfolioLinkChange(item.id, e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#0A5C36] outline-none"
                              />
                              <button 
                                onClick={() => onDeletePortfolio(item.id)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'news' && (
              <motion.div 
                key="news"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold">게시글 관리</h2>
                  <button 
                    onClick={() => onAddPost({
                      title: '새로운 공지사항',
                      content: '내용을 입력하세요.',
                      author: '관리자'
                    })}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0A5C36] rounded-full font-bold hover:bg-[#0c7042] transition-all"
                  >
                    <Plus size={18} /> 작성하기
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {posts.map(post => (
                    <div key={post.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-lg mb-1">{post.title}</h4>
                        <p className="text-white/40 text-sm">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                      <button 
                        onClick={() => onDeletePost(post.id)}
                        className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [sRes, pRes, nRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/portfolios'),
        fetch('/api/posts')
      ]);
      setSettings(await sRes.json());
      setPortfolios(await pRes.json());
      setPosts(await nRes.json());
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateSettings = async (updates: Partial<SiteSettings>) => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    fetchData();
  };

  const handleAddPortfolio = async (p: Partial<Portfolio>) => {
    await fetch('/api/portfolios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    });
    fetchData();
  };

  const handleDeletePortfolio = async (id: number) => {
    await fetch(`/api/portfolios/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleUpdatePortfolio = async (id: number, updates: Partial<Portfolio>) => {
    await fetch(`/api/portfolios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    fetchData();
  };

  const handleAddPost = async (p: Partial<Post>) => {
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    });
    fetchData();
  };

  const handleDeletePost = async (id: number) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    fetchData();
  };

  if (loading || !settings) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-[#0A5C36] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#0A5C36] selection:text-white">
      <Navbar onAdminClick={() => setIsAdmin(!isAdmin)} isAdmin={isAdmin} />
      
      {isAdmin ? (
        <AdminDashboard 
          settings={settings}
          portfolios={portfolios}
          posts={posts}
          onUpdateSettings={handleUpdateSettings}
          onAddPortfolio={handleAddPortfolio}
          onDeletePortfolio={handleDeletePortfolio}
          onUpdatePortfolio={handleUpdatePortfolio}
          onAddPost={handleAddPost}
          onDeletePost={handleDeletePost}
        />
      ) : (
        <main>
          <Hero settings={settings} />
          <section id="services" className="py-32 px-6 border-y border-white/5">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-6 group">
                  <div className="w-16 h-16 bg-[#0A5C36]/10 rounded-2xl flex items-center justify-center text-[#0A5C36] group-hover:bg-[#0A5C36] group-hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(10,92,54,0)] group-hover:shadow-[0_0_30px_rgba(10,92,54,0.4)]">
                    <Stethoscope size={32} />
                  </div>
                  <h3 className="text-2xl font-bold">병원 유튜브</h3>
                  <p className="text-white/50 leading-relaxed">
                    병원 전문 브랜딩을 위한 유튜브 채널 기획부터 촬영, 편집까지. 신뢰감을 주는 고퀄리티 의료 콘텐츠를 제작합니다.
                  </p>
                </div>
                <div className="space-y-6 group">
                  <div className="w-16 h-16 bg-[#0A5C36]/10 rounded-2xl flex items-center justify-center text-[#0A5C36] group-hover:bg-[#0A5C36] group-hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(10,92,54,0)] group-hover:shadow-[0_0_30px_rgba(10,92,54,0.4)]">
                    <Building2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold">병원·기업 홍보영상</h3>
                  <p className="text-white/50 leading-relaxed">
                    브랜드의 가치를 시각적으로 극대화하는 시네마틱 홍보 영상을 제작합니다. 전문성과 신뢰를 담은 최상의 결과물을 보장합니다.
                  </p>
                </div>
                <div className="space-y-6 group">
                  <div className="w-16 h-16 bg-[#0A5C36]/10 rounded-2xl flex items-center justify-center text-[#0A5C36] group-hover:bg-[#0A5C36] group-hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(10,92,54,0)] group-hover:shadow-[0_0_30px_rgba(10,92,54,0.4)]">
                    <GraduationCap size={32} />
                  </div>
                  <h3 className="text-2xl font-bold">강의영상</h3>
                  <p className="text-white/50 leading-relaxed">
                    전달력을 높이는 깔끔한 편집과 자막 디자인으로 학습 효율을 극대화하는 전문 교육 및 강의 영상을 제작합니다.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <PortfolioGrid portfolios={portfolios} />
          <ContactSection settings={settings} />
          <DownloadSection />
          <Footer settings={settings} />
        </main>
      )}
    </div>
  );
}
