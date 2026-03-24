import React, { useState, useEffect, Fragment, Component, ReactNode } from 'react';
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
  LogIn,
  AlertCircle
} from 'lucide-react';
import { SiteSettings, Portfolio, Post } from './types';
import { db, auth, signInWithGoogle, logout } from './firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

// --- Error Handling ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<any, any> {
  state = { hasError: false, error: null as any };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    const { hasError, error } = this.state;
    if (hasError) {
      let errorMessage = "알 수 없는 오류가 발생했습니다.";
      try {
        if (error?.message) {
          const parsed = JSON.parse(error.message);
          if (parsed.error && parsed.error.includes("permissions")) {
            errorMessage = "권한이 없거나 접근이 거부되었습니다. 관리자 계정으로 로그인되어 있는지 확인해주세요.";
          }
        }
      } catch (e) {
        // Not JSON
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">오류 발생</h2>
            <p className="text-white/60 mb-8">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-[#0A5C36] rounded-full font-bold hover:bg-[#0c7042] transition-all"
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

// --- Components ---

const Navbar = ({ 
  onAdminClick, 
  isAdmin, 
  showAdminAccess, 
  setShowAdminAccess, 
  logoClickCount, 
  setLogoClickCount 
}: { 
  onAdminClick: () => void, 
  isAdmin: boolean,
  showAdminAccess: boolean,
  setShowAdminAccess: (show: boolean) => void,
  logoClickCount: number,
  setLogoClickCount: (count: number) => void
}) => {
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

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount >= 5) {
      setShowAdminAccess(true);
      setLogoClickCount(0);
    }
    // Reset count after 2 seconds of inactivity
    setTimeout(() => setLogoClickCount(0), 2000);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="text-2xl font-bold tracking-tighter flex items-center gap-2 cursor-pointer select-none" 
          onClick={() => {
            scrollTo('home');
            handleLogoClick();
          }}
        >
          <div className="w-8 h-8 bg-[#0A5C36] rounded-sm flex items-center justify-center text-xs">01</div>
          <span>ZERO ONE</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <button onClick={() => scrollTo('home')} className="hover:text-white transition-colors">홈</button>
          <button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">서비스</button>
          <button onClick={() => scrollTo('portfolio')} className="hover:text-white transition-colors">포트폴리오</button>
          <button onClick={() => scrollTo('contact')} className="hover:text-white transition-colors">문의하기</button>
          
          {showAdminAccess && (
            <button 
              onClick={onAdminClick}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-white"
            >
              {isAdmin ? <LogOut size={16} /> : <LayoutDashboard size={16} />}
              {isAdmin ? '나가기' : '관리자'}
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          {showAdminAccess && (
            <button 
              onClick={onAdminClick}
              className="p-2 bg-white/5 rounded-full border border-white/10 text-white"
            >
              {isAdmin ? <LogOut size={18} /> : <LayoutDashboard size={18} />}
            </button>
          )}
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
          {settings.site_name}
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

const PortfolioGrid = ({ portfolios, settings }: { portfolios: Portfolio[], settings: SiteSettings }) => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const categoriesStr = settings.categories || '브이로그,정보전달,토크,강의';
  const categories = ['ALL', ...categoriesStr.split(',').map(c => c.trim())];

  const filteredPortfolios = (activeCategory === 'ALL' 
    ? [...portfolios].sort((a, b) => b.is_featured - a.is_featured)
    : portfolios.filter(p => p.category === activeCategory)
  ).slice(0, 6);

  return (
    <section id="portfolio" className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-4xl font-bold mb-4 tracking-tighter">PORTFOLIO</h2>
            <p className="text-white/50">우리의 감각으로 탄생한 결과물들입니다.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                  activeCategory === cat 
                    ? 'bg-[#0A5C36] border-[#0A5C36] text-white' 
                    : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPortfolios.map((item, idx) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
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
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-[#0A5C36] uppercase tracking-widest">{item.category}</span>
                  <h3 className="text-lg font-bold mt-1 group-hover:text-[#0A5C36] transition-colors">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
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
  onDeletePortfolio: (id: string) => void,
  onUpdatePortfolio: (id: string, p: Partial<Portfolio>) => void,
  onAddPost: (p: Partial<Post>) => void,
  onDeletePost: (id: string) => void
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'portfolio' | 'news'>('general');
  const [localSettings, setLocalSettings] = useState(settings);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setLocalSettings(settings);
    }
  }, [settings, isEditing]);

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    setIsEditing(false);
  };

  const handleChange = (updates: Partial<SiteSettings>) => {
    setLocalSettings(prev => ({ ...prev, ...updates }));
    setIsEditing(true);
  };

  const handlePortfolioLinkChange = (id: string, url: string) => {
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
                      onChange={e => handleChange({ site_name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">포인트 컬러</label>
                    <div className="flex gap-4">
                      <input 
                        type="color" 
                        value={localSettings.primary_color}
                        onChange={e => handleChange({ primary_color: e.target.value })}
                        className="w-12 h-12 bg-transparent border-none outline-none cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={localSettings.primary_color}
                        onChange={e => handleChange({ primary_color: e.target.value })}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">메인 타이틀 (Hero Title)</label>
                    <textarea 
                      rows={2}
                      value={localSettings.hero_title}
                      onChange={e => handleChange({ hero_title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">서브 타이틀 (Hero Subtitle)</label>
                    <textarea 
                      rows={2}
                      value={localSettings.hero_subtitle}
                      onChange={e => handleChange({ hero_subtitle: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">문의 이메일</label>
                    <input 
                      type="email" 
                      value={localSettings.contact_email}
                      onChange={e => handleChange({ contact_email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">문의 연락처</label>
                    <input 
                      type="text" 
                      value={localSettings.contact_phone}
                      onChange={e => handleChange({ contact_phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">문의 주소</label>
                    <input 
                      type="text" 
                      value={localSettings.contact_address}
                      onChange={e => handleChange({ contact_address: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">유튜브 URL</label>
                    <input 
                      type="text" 
                      value={localSettings.youtube_url}
                      onChange={e => handleChange({ youtube_url: e.target.value })}
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
                className="space-y-12"
              >
                {/* Category Management */}
                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">카테고리 관리</h3>
                    <button 
                      onClick={handleSaveSettings}
                      className="flex items-center gap-2 px-4 py-2 bg-[#0A5C36]/20 text-[#0A5C36] rounded-full text-xs font-bold hover:bg-[#0A5C36] hover:text-white transition-all"
                    >
                      <Save size={14} /> 카테고리 저장
                    </button>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest">카테고리 목록 (쉼표로 구분)</label>
                    <input 
                      type="text" 
                      value={localSettings.categories}
                      onChange={e => handleChange({ categories: e.target.value })}
                      placeholder="브이로그, 정보전달, 토크, 강의"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all"
                    />
                    <p className="text-[10px] text-white/20 leading-relaxed">
                      * 카테고리를 추가하거나 삭제한 후 반드시 '카테고리 저장' 버튼을 눌러주세요.<br />
                      * 삭제된 카테고리에 속한 포트폴리오는 다른 카테고리로 재지정해야 합니다.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold">포트폴리오 관리</h2>
                      <p className="text-white/30 text-sm mt-1">
                        메인 화면(ALL)에는 <span className="text-[#0A5C36] font-bold">최대 6개</span>의 영상이 표시됩니다. 
                        (현재 <span className="text-white font-bold">{portfolios.filter(p => p.is_featured).length}개</span> 선택됨)
                      </p>
                    </div>
                    <button 
                      onClick={() => onAddPortfolio({
                        title: '새로운 프로젝트',
                        description: '',
                        thumbnail: 'https://picsum.photos/seed/new/800/450',
                        video_url: '',
                        category: (settings.categories || '브이로그').split(',')[0].trim(),
                        is_featured: 0
                      })}
                      className="flex items-center gap-2 px-6 py-3 bg-[#0A5C36] rounded-full font-bold hover:bg-[#0c7042] transition-all"
                    >
                      <Plus size={18} /> 추가하기
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {portfolios.map(item => (
                      <div key={item.id} className={`p-6 rounded-2xl bg-white/5 border transition-all ${item.is_featured ? 'border-[#0A5C36]' : 'border-white/10'}`}>
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-64 aspect-video bg-black rounded-xl overflow-hidden border border-white/10 relative group">
                            <img src={item.thumbnail} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                            {item.is_featured === 1 && (
                              <div className="absolute top-3 left-3 px-3 py-1 bg-[#0A5C36] text-white text-[10px] font-bold rounded-full shadow-lg">
                                메인 노출 중
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">제목</label>
                                  <input 
                                    type="text" 
                                    value={item.title}
                                    onChange={e => onUpdatePortfolio(item.id, { title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#0A5C36] outline-none"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">카테고리</label>
                                  <select 
                                    value={item.category}
                                    onChange={e => onUpdatePortfolio(item.id, { category: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#0A5C36] outline-none"
                                  >
                                    {(settings.categories || '브이로그,정보전달,토크,강의').split(',').map(cat => (
                                      <option key={cat.trim()} value={cat.trim()}>{cat.trim()}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              
                              <button 
                                onClick={() => onUpdatePortfolio(item.id, { is_featured: item.is_featured ? 0 : 1 })}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${
                                  item.is_featured 
                                    ? 'bg-[#0A5C36] border-[#0A5C36] text-white' 
                                    : 'bg-white/5 border-white/10 text-white/30 hover:border-white/30'
                                }`}
                              >
                                {item.is_featured ? '메인 노출 취소' : '메인 노출 선택'}
                              </button>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">설명</label>
                              <textarea 
                                value={item.description}
                                onChange={e => onUpdatePortfolio(item.id, { description: e.target.value })}
                                rows={2}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#0A5C36] outline-none resize-none"
                              />
                            </div>
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
                        <p className="text-white/40 text-sm">
                          {post.created_at instanceof Timestamp 
                            ? post.created_at.toDate().toLocaleDateString() 
                            : new Date(post.created_at).toLocaleDateString()}
                        </p>
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
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: "제로원프로덕션",
    hero_title: "세상을 바꾸는 단 하나의 영상\n제로원프로덕션",
    hero_subtitle: "최고의 퀄리티로 당신의 브랜드 가치를 높여드립니다.",
    primary_color: "#0A5C36",
    bg_color: "#000000",
    contact_email: "contact@zeroone.pro",
    contact_phone: "010-7788-9757",
    contact_address: "서울특별시 마포구 월드컵북로 179, 208호",
    youtube_url: "https://youtube.com/@zeroone",
    instagram_url: "https://instagram.com/zeroone",
    categories: "브이로그,정보전달,토크,강의"
  });
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  useEffect(() => {
    // Check URL for ?admin or pathname /admin
    const params = new URLSearchParams(window.location.search);
    if (params.has('admin') || window.location.pathname === '/admin') {
      setShowAdminAccess(true);
      setIsAdmin(true);
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // If already logged in as admin, always show access
      if (user?.email === 'zeroonepro0207@gmail.com') {
        setShowAdminAccess(true);
      }
    });

    const isAdminUser = (u: User | null) => u?.email === 'zeroonepro0207@gmail.com';

    console.log("Current Domain for Firebase Auth:", window.location.hostname);

    // Real-time settings
    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'site'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as SiteSettings);
      } else if (isAdminUser(auth.currentUser)) {
        // Seed initial settings if missing AND user is admin
        setDoc(doc(db, 'settings', 'site'), settings).catch(err => handleFirestoreError(err, OperationType.WRITE, 'settings/site'));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/site'));

    // Real-time portfolios
    const qPortfolios = query(collection(db, 'portfolios'), orderBy('created_at', 'desc'));
    const unsubscribePortfolios = onSnapshot(qPortfolios, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Portfolio[];
      setPortfolios(items);
      
      // Seed initial portfolios if empty AND user is admin
      if (items.length === 0 && isAdminUser(auth.currentUser)) {
        const initialPortfolios = [
          { title: "성형외과 전문의 인터뷰 영상", description: "의료진의 신뢰도를 높이는 전문 인터뷰 및 병원 소개 영상", thumbnail: "https://picsum.photos/seed/hospital-1/800/450", video_url: "https://youtube.com", category: "Hospital YouTube", is_featured: 1, created_at: serverTimestamp() },
          { title: "IT 기업 브랜드 필름", description: "혁신적인 기업 이미지를 강조한 시네마틱 홍보 영상", thumbnail: "https://picsum.photos/seed/corporate/800/450", video_url: "https://youtube.com", category: "Promotion Video", is_featured: 1, created_at: serverTimestamp() },
          { title: "공인중개사 자격증 핵심 강의", description: "전달력을 극대화한 깔끔한 자막과 모션 그래픽 강의 영상", thumbnail: "https://picsum.photos/seed/lecture/800/450", video_url: "https://youtube.com", category: "Lecture Video", is_featured: 1, created_at: serverTimestamp() },
          { title: "치과 임플란트 시술 안내", description: "환자들의 이해를 돕는 친절한 시술 과정 안내 영상", thumbnail: "https://picsum.photos/seed/hospital-2/800/450", video_url: "https://youtube.com", category: "Hospital YouTube", is_featured: 1, created_at: serverTimestamp() },
          { title: "글로벌 제조 기업 공장 스케치", description: "웅장한 스케일의 기업 시설 및 공정 홍보 영상", thumbnail: "https://picsum.photos/seed/factory/800/450", video_url: "https://youtube.com", category: "Promotion Video", is_featured: 1, created_at: serverTimestamp() },
          { title: "마케팅 실무 마스터 클래스", description: "실제 사례 중심의 몰입감 넘치는 온라인 강의 콘텐츠", thumbnail: "https://picsum.photos/seed/marketing/800/450", video_url: "https://youtube.com", category: "Lecture Video", is_featured: 1, created_at: serverTimestamp() }
        ];
        initialPortfolios.forEach(p => addDoc(collection(db, 'portfolios'), p).catch(err => handleFirestoreError(err, OperationType.CREATE, 'portfolios')));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'portfolios'));

    // Real-time posts
    const qPosts = query(collection(db, 'posts'), orderBy('created_at', 'desc'));
    const unsubscribePosts = onSnapshot(qPosts, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Post[];
      setPosts(items);
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'posts'));

    return () => {
      unsubscribeAuth();
      unsubscribeSettings();
      unsubscribePortfolios();
      unsubscribePosts();
    };
  }, []);

  const handleUpdateSettings = async (updates: Partial<SiteSettings>) => {
    try {
      await updateDoc(doc(db, 'settings', 'site'), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/site');
    }
  };

  const handleAddPortfolio = async (portfolio: Partial<Portfolio>) => {
    try {
      await addDoc(collection(db, 'portfolios'), {
        ...portfolio,
        created_at: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'portfolios');
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'portfolios', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `portfolios/${id}`);
    }
  };

  const handleUpdatePortfolio = async (id: string, updates: Partial<Portfolio>) => {
    try {
      await updateDoc(doc(db, 'portfolios', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `portfolios/${id}`);
    }
  };

  const handleAddPost = async (post: Partial<Post>) => {
    try {
      await addDoc(collection(db, 'posts'), {
        ...post,
        created_at: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'posts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `posts/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0A5C36] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-[#0A5C36] selection:text-white">
        <Navbar 
          onAdminClick={() => setIsAdmin(!isAdmin)} 
          isAdmin={isAdmin}
          showAdminAccess={showAdminAccess}
          setShowAdminAccess={setShowAdminAccess}
          logoClickCount={logoClickCount}
          setLogoClickCount={setLogoClickCount}
        />
        
        <main>
          {isAdmin ? (
            user ? (
              user.email === 'zeroonepro0207@gmail.com' ? (
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
                <div className="min-h-screen flex items-center justify-center p-6">
                  <div className="max-w-md w-full p-12 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl text-center">
                    <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                      <AlertCircle size={40} className="text-red-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 tracking-tight">접근 거부</h2>
                    <p className="text-white/40 mb-10 leading-relaxed">
                      관리자 권한이 없는 계정입니다.<br />({user.email})
                    </p>
                    <div className="flex flex-col gap-4">
                      <button 
                        onClick={() => auth.signOut()}
                        className="w-full py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all"
                      >
                        다른 계정으로 로그인
                      </button>
                      <button 
                        onClick={() => setIsAdmin(false)}
                        className="w-full py-4 text-white/40 font-bold rounded-2xl hover:text-white transition-all"
                      >
                        홈으로 돌아가기
                      </button>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="min-h-screen flex items-center justify-center p-6">
                <div className="max-w-md w-full p-12 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl text-center">
                  <div className="w-20 h-20 bg-[#0A5C36]/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <LayoutDashboard size={40} className="text-[#0A5C36]" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 tracking-tight">관리자 로그인</h2>
                  <p className="text-white/40 mb-10 leading-relaxed">
                    포트폴리오와 사이트 설정을 관리하려면<br />로그인이 필요합니다.
                    <br />
                    <span className="text-[10px] mt-2 block text-white/20">
                      * 배포 환경에서 로그인이 되지 않을 경우, Firebase 콘솔의 '승인된 도메인'에 현재 URL이 등록되어 있는지 확인해주세요.
                    </span>
                  </p>
                  <button 
                    onClick={async () => {
                      try {
                        await signInWithGoogle();
                      } catch (error: any) {
                        console.error("Login failed:", error);
                        alert(`로그인에 실패했습니다: ${error.message || '알 수 없는 오류'}\n\n브라우저의 팝업 차단 설정을 확인하거나, Firebase 콘솔에서 현재 도메인이 승인되었는지 확인해주세요.`);
                      }
                    }}
                    className="w-full py-5 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all flex items-center justify-center gap-3"
                  >
                    <LogIn size={20} /> 구글로 로그인하기
                  </button>
                </div>
              </div>
            )
          ) : (
            <>
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
              <PortfolioGrid portfolios={portfolios} settings={settings} />
              <ContactSection settings={settings} />
            </>
          )}
        </main>

        <Footer settings={settings} />
      </div>
    </ErrorBoundary>
  );
}
