import React, { useState, useEffect, useRef, Fragment, Component, ReactNode } from 'react';
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
  AlertCircle,
  Sparkles,
  ArrowRight,
  Check,
  RefreshCw
} from 'lucide-react';
import { SiteSettings, Portfolio, Post } from './types';
import { db, auth, signInWithGoogle, logout } from './firebase';
import { DEFAULT_PORTFOLIOS, CAROUSEL_PORTFOLIOS } from './data/defaultPortfolios';
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
}: { 
  onAdminClick: () => void, 
  isAdmin: boolean,
  showAdminAccess: boolean,
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center relative">
        {/* Desktop Menu - 가운데 정렬 */}
        <div className="hidden md:flex items-center justify-center gap-10 text-sm font-medium text-white/70">
          <button onClick={() => scrollTo('home')} className="hover:text-white transition-colors cursor-pointer">홈</button>
          <button onClick={() => scrollTo('services')} className="hover:text-white transition-colors cursor-pointer">서비스</button>
          <button onClick={() => scrollTo('portfolio')} className="hover:text-white transition-colors cursor-pointer">포트폴리오</button>
          <button onClick={() => scrollTo('pricing')} className="hover:text-white transition-colors cursor-pointer">가격안내</button>
          <button onClick={() => scrollTo('contact')} className="hover:text-white transition-colors cursor-pointer">문의하기</button>
        </div>

        {/* Desktop Admin Access Toggle (우측 절대 배치) */}
        {showAdminAccess && (
          <div className="hidden md:block absolute right-6">
            <button 
              onClick={onAdminClick}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-white text-sm cursor-pointer"
            >
              {isAdmin ? <LogOut size={16} /> : <LayoutDashboard size={16} />}
              {isAdmin ? '나가기' : '관리자'}
            </button>
          </div>
        )}

        {/* Mobile Menu Toggle (우측 정렬) */}
        <div className="md:hidden flex items-center justify-end w-full gap-4">
          {showAdminAccess && (
            <button 
              onClick={onAdminClick}
              className="p-2 bg-white/5 rounded-full border border-white/10 text-white cursor-pointer"
            >
              {isAdmin ? <LogOut size={18} /> : <LayoutDashboard size={18} />}
            </button>
          )}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white cursor-pointer"
            aria-label="메뉴 열기"
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
            <div className="px-6 py-8 flex flex-col items-center gap-6 text-lg font-medium">
              <button onClick={() => scrollTo('home')} className="hover:text-[#0A5C36] transition-colors cursor-pointer">홈</button>
              <button onClick={() => scrollTo('services')} className="hover:text-[#0A5C36] transition-colors cursor-pointer">서비스</button>
              <button onClick={() => scrollTo('portfolio')} className="hover:text-[#0A5C36] transition-colors cursor-pointer">포트폴리오</button>
              <button onClick={() => scrollTo('pricing')} className="hover:text-[#0A5C36] transition-colors cursor-pointer">가격안내</button>
              <button onClick={() => scrollTo('contact')} className="hover:text-[#0A5C36] transition-colors cursor-pointer">문의하기</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const getYoutubeId = (url?: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  return null;
};

const Hero = ({ settings }: { settings: SiteSettings }) => {
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const videoUrl = settings.hero_video_url || '/hero-video.mp4';
  const ytId = getYoutubeId(videoUrl);

  useEffect(() => {
    setHasVideoError(false);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy handled silently
      });
    }
  }, [videoUrl]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Video Player */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {ytId ? (
          <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
              title="Hero Background Video"
              className="w-[150vw] h-[150vh] min-w-full min-h-full object-cover scale-125 opacity-70 pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              onError={() => setHasVideoError(true)}
              className="w-full h-full object-cover opacity-75"
              src={videoUrl}
            />
            {/* Fallback subtle motion grid if video not yet found */}
            {hasVideoError && (
              <div className="absolute inset-0 z-0 opacity-25">
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 p-2 grayscale">
                  {[...Array(24)].map((_, i) => (
                    <div key={i} className="aspect-video bg-white/5 rounded-lg overflow-hidden border border-white/5">
                      <img 
                        src={`https://picsum.photos/seed/hospital-${i}/400/225`} 
                        className="w-full h-full object-cover"
                        alt="Thumbnail"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Cinematic dark gradients over the video */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_85%)]" />

        {/* Viewfinder Overlay */}
        <div className="absolute inset-8 md:inset-12 border border-white/10 pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#0A5C36]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#0A5C36]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#0A5C36]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#0A5C36]" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase">REC 00:00:01:24</span>
          </div>
        </div>
      </div>

      {/* Action Buttons placed right above SCROLL Indicator */}
      <div className="absolute bottom-8 md:bottom-12 left-0 right-0 z-10 flex flex-col items-center gap-6 md:gap-7 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-row items-center justify-center gap-3.5 sm:gap-5 flex-wrap"
        >
          {/* (포트폴리오) 버튼 */}
          <button 
            onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 sm:px-10 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 backdrop-blur-md rounded-full transition-all font-bold text-white text-sm sm:text-base cursor-pointer shadow-lg hover:shadow-white/10 active:scale-[0.98]"
          >
            포트폴리오
          </button>

          {/* (플랜보기) 버튼 - 클릭 시 가격안내(#pricing)로 스크롤 */}
          <button 
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 sm:px-10 py-3.5 sm:py-4 bg-[#0A5C36] hover:bg-[#0c7042] text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 group shadow-[0_10px_30px_rgba(10,92,54,0.4)] backdrop-blur-md text-sm sm:text-base cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            플랜보기 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Scroll Indicator with breathing glow effect */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-2 pointer-events-none"
        >
          <motion.span 
            animate={{
              opacity: [0.35, 1, 0.35],
              textShadow: [
                "0 0 4px rgba(255,255,255,0.2), 0 0 10px rgba(10,92,54,0.3)",
                "0 0 15px rgba(255,255,255,1), 0 0 25px rgba(52,211,153,0.9), 0 0 35px rgba(10,92,54,0.9)",
                "0 0 4px rgba(255,255,255,0.2), 0 0 10px rgba(10,92,54,0.3)"
              ]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.55em] text-white uppercase select-none pl-1"
          >
            SCROLL
          </motion.span>
          <motion.div 
            animate={{
              opacity: [0.3, 1, 0.3],
              boxShadow: [
                "0 0 4px rgba(10,92,54,0.2)",
                "0 0 12px rgba(52,211,153,0.9)",
                "0 0 4px rgba(10,92,54,0.2)"
              ]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-[1.5px] h-7 sm:h-9 bg-gradient-to-b from-white via-[#0A5C36] to-transparent rounded-full" 
          />
        </motion.div>
      </div>
    </section>
  );
};

const fetchYoutubeTitle = async (url: string): Promise<string | null> => {
  if (!url) return null;
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.title || null;
  } catch {
    return null;
  }
};

const PortfolioGrid = ({ portfolios, settings }: { portfolios: Portfolio[], settings: SiteSettings }) => {
  // Use ONLY portfolios registered by the user in the admin dashboard (Firestore).
  // Fall back to DEFAULT_PORTFOLIOS only when the database is completely empty.
  const displayPortfolios = portfolios.length > 0 ? portfolios : DEFAULT_PORTFOLIOS;

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; video_url: string } | null>(null);

  // Extract all categories available from settings and uploaded portfolios
  const rawCategories = (settings.categories || '시술 정보,트렌드/이슈,원장님 토크,리얼 후기')
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);
  
  const portfolioCategories = Array.from(new Set(displayPortfolios.map(p => p.category).filter(Boolean)));
  const combinedCategories = Array.from(new Set([...rawCategories, ...portfolioCategories]));
  const categories = ['ALL', ...combinedCategories];

  // Filter items according to activeCategory
  const filteredItems = activeCategory === 'ALL'
    ? [...displayPortfolios].sort((a, b) => (b.is_featured || 0) - (a.is_featured || 0))
    : displayPortfolios.filter(p => p.category === activeCategory);

  // 6 main video cards for the 2x3 grid
  const gridItems = filteredItems.slice(0, 6);

  // Flowing ticker items: ONLY from the user's admin portfolios
  const userTickerPortfolios = displayPortfolios.filter(p => p.is_ticker === 1 || p.is_ticker === (true as any));
  const rawTickerItems = userTickerPortfolios.length > 0 ? userTickerPortfolios : displayPortfolios;

  // Duplicate items cleanly for a seamless infinite marquee loop without any third-party/temporary videos
  const tickerItems = rawTickerItems.length > 0
    ? (rawTickerItems.length < 6 
        ? [...rawTickerItems, ...rawTickerItems, ...rawTickerItems, ...rawTickerItems].slice(0, 12) 
        : rawTickerItems)
    : [];

  return (
    <section id="portfolio" className="py-24 sm:py-32 px-4 sm:px-6 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header: Title + Category Tabs */}
        <div className="mb-10 sm:mb-14 flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-white/5 pb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">PORTFOLIO</h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 border cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#0A5C36] border-[#0A5C36] text-white shadow-[0_0_20px_rgba(10,92,54,0.4)]'
                      : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 2 Rows x 3 Columns Main Grid with Responsive Category Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 min-h-[300px]"
          >
            {gridItems.length > 0 ? (
              gridItems.map((item, idx) => (
                <motion.div 
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.35, 
                    delay: idx * 0.045, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
                  whileTap={{ scale: 0.98 }}
                  className="group cursor-pointer flex flex-col"
                  onClick={() => setSelectedVideo({ title: item.title, video_url: item.video_url })}
                >
                  {/* 16:9 Thumbnail Container */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-900 border border-white/5 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.8)]">
                    <img 
                      src={item.thumbnail} 
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
                      alt={item.title}
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Top-Right Circular Play Badge */}
                    <div className="absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center shadow-lg pointer-events-none transition-transform duration-300 group-hover:scale-110">
                      <Play className="fill-black text-black ml-0.5" size={14} />
                    </div>

                    {/* Dark hover overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* Video Title Below Thumbnail (exact title from Admin page) */}
                  <div className="mt-3 px-1">
                    <h3 className="text-[14px] sm:text-[15px] font-medium text-white/95 leading-snug group-hover:text-white transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center text-white/40 flex flex-col items-center justify-center"
              >
                <p className="text-base font-medium">해당 카테고리에 등록된 영상이 없습니다.</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Continuous Flowing Marquee Ticker (우에서 좌로 계속 흘러가는 영상들 - 관리자 포트폴리오 영상만 노출) */}
        {tickerItems.length > 0 && (
          <div className="mt-16 sm:mt-20 pt-10 border-t border-white/10 relative">
            <div className="relative overflow-hidden w-full py-2">
              {/* Left / Right gradient masks for smooth edge fade */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-black to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-black to-transparent z-10" />

              {/* Continuous Marquee Track (flows from right to left) */}
              <div className="flex animate-marquee gap-4 sm:gap-6">
                {/* First Track Copy */}
                {tickerItems.map((item, idx) => (
                  <div
                    key={`track1-${item.id || idx}`}
                    onClick={() => setSelectedVideo({ title: item.title, video_url: item.video_url })}
                    className="flex-shrink-0 w-[220px] sm:w-[260px] md:w-[290px] cursor-pointer group flex flex-col"
                  >
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-900 border border-white/10 group-hover:border-white/30 transition-all duration-300">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                          <Play className="fill-black text-black ml-0.5" size={12} />
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs sm:text-[13px] font-medium text-white/75 group-hover:text-white truncate transition-colors px-1">
                      {item.title}
                    </p>
                  </div>
                ))}

                {/* Second Track Copy for seamless infinite loop */}
                {tickerItems.map((item, idx) => (
                  <div
                    key={`track2-${item.id || idx}`}
                    onClick={() => setSelectedVideo({ title: item.title, video_url: item.video_url })}
                    className="flex-shrink-0 w-[220px] sm:w-[260px] md:w-[290px] cursor-pointer group flex flex-col"
                  >
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-900 border border-white/10 group-hover:border-white/30 transition-all duration-300">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                          <Play className="fill-black text-black ml-0.5" size={12} />
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs sm:text-[13px] font-medium text-white/75 group-hover:text-white truncate transition-colors px-1">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-neutral-950 rounded-2xl overflow-hidden border border-white/15 shadow-2xl flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b border-white/10">
                <h4 className="text-sm sm:text-base font-bold text-white truncate pr-4">
                  {selectedVideo.title}
                </h4>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {selectedVideo.video_url && (
                    <a
                      href={selectedVideo.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/75 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
                    >
                      <span>유튜브에서 보기</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="relative aspect-video w-full bg-black">
                {getYoutubeId(selectedVideo.video_url) ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${getYoutubeId(selectedVideo.video_url)}?autoplay=1&rel=0`}
                    title={selectedVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-white/80 font-medium mb-4 max-w-md">{selectedVideo.title}</p>
                    <a
                      href={selectedVideo.video_url || "https://youtube.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full bg-[#0A5C36] hover:bg-[#0c7042] text-white font-bold text-sm inline-flex items-center gap-2 transition-all shadow-lg"
                    >
                      <Play size={16} fill="white" />
                      <span>YouTube에서 시청하기</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

interface PlanTableRow {
  category: string;
  categoryRowSpan?: number;
  subItem?: string;
  quantity?: string;
}

interface PricingPlanData {
  id: string;
  name: string;
  price: string;
  vatInfo: string;
  isPopular?: boolean;
  badge?: string;
  tableRows: PlanTableRow[];
}

const PRICING_PLANS: PricingPlanData[] = [
  {
    id: 'plan-a',
    name: '플랜A',
    price: '월 2,750,000원',
    vatInfo: 'VAT 포함',
    isPopular: false,
    badge: '스타터 플랜',
    tableRows: [
      { category: '촬영', categoryRowSpan: 1, subItem: '', quantity: '월 1회' },
      { category: '편집', categoryRowSpan: 2, subItem: '롱폼', quantity: '월 4편' },
      { category: '', subItem: '숏폼', quantity: '월 4편 (본편 기반 발췌)' },
      { category: '채널 관리', categoryRowSpan: 2, subItem: '업로드 대행', quantity: '' },
      { category: '', subItem: '채널 아트 제작', quantity: '' },
    ]
  },
  {
    id: 'plan-b',
    name: '플랜B',
    price: '월 3,300,000원',
    vatInfo: 'VAT 포함',
    isPopular: false,
    badge: '',
    tableRows: [
      { category: '기획', categoryRowSpan: 1, subItem: '', quantity: '월 4회' },
      { category: '촬영', categoryRowSpan: 1, subItem: '', quantity: '월 2회' },
      { category: '편집', categoryRowSpan: 2, subItem: '롱폼', quantity: '월 4편' },
      { category: '', subItem: '숏폼', quantity: '월 8편 (본편 기반 발췌)' },
      { category: '채널 관리', categoryRowSpan: 2, subItem: '업로드 대행', quantity: '' },
      { category: '', subItem: '채널 아트 제작', quantity: '' },
    ]
  },
  {
    id: 'plan-c',
    name: '플랜C',
    price: '월 4,400,000원',
    vatInfo: 'VAT 포함',
    isPopular: false,
    badge: '프리미엄 올인원',
    tableRows: [
      { category: '기획', categoryRowSpan: 1, subItem: '', quantity: '월 4회' },
      { category: '촬영', categoryRowSpan: 1, subItem: '', quantity: '월 2회' },
      { category: '편집', categoryRowSpan: 2, subItem: '롱폼', quantity: '월 4편' },
      { category: '', subItem: '숏폼', quantity: '월 8편 (본편 기반 발췌)' },
      { category: '채널 관리', categoryRowSpan: 2, subItem: '업로드 대행', quantity: '' },
      { category: '', subItem: '채널 아트 제작', quantity: '' },
      { category: '광고 운영', categoryRowSpan: 1, subItem: '조회수 및 댓글', quantity: '' },
    ]
  }
];

const PricingSection = ({ onSelectPlan }: { onSelectPlan: (planName: string) => void }) => (
  <section id="pricing" className="py-32 px-6 bg-[#050505] border-t border-white/5 relative">
    <div className="max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
          유튜브 콘텐츠 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A5C36] to-emerald-400">가격 안내</span>
        </h2>
        <p className="text-white/30 text-sm mt-3 leading-relaxed">
          채널 성장에 최적화된 기획·촬영·편집·채널 관리 패키지를 확인해보세요.
        </p>
      </div>

      {/* Pricing Cards Grid matching user image (IMG_6033.jpeg) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-7 md:p-8 flex flex-col justify-between transition-all duration-300 relative ${
              plan.isPopular
                ? 'bg-gradient-to-b from-[#0A5C36]/15 via-[#0c0c0c] to-[#080808] border-2 border-[#0A5C36] shadow-[0_0_50px_rgba(10,92,54,0.25)] lg:-translate-y-2'
                : 'bg-white/[0.02] border border-white/10 hover:border-white/20 shadow-lg'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0A5C36] text-white text-xs font-extrabold rounded-full shadow-lg tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                <Sparkles size={12} /> {plan.badge}
              </div>
            )}

            <div>
              {/* Header Title with vertical accent bar */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-6 bg-[#2B6CB0] rounded-full inline-block" />
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{plan.name}</h3>
                </div>
                {!plan.isPopular && plan.badge && (
                  <span className="text-[11px] font-medium text-white/40 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                    {plan.badge}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-6 flex items-baseline gap-1.5 flex-wrap">
                <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{plan.price}</span>
                <span className="text-sm font-semibold text-white/60">({plan.vatInfo})</span>
              </div>

              {/* Table directly replicating IMG_6033.jpeg */}
              <div className="overflow-hidden rounded-xl border border-white/10 shadow-inner bg-black/50 mb-6">
                <table className="w-full text-xs md:text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#2B6CB0] text-white text-center font-bold">
                      <th className="py-2.5 px-3 border-r border-blue-400/30 w-[26%] text-center">구분</th>
                      <th className="py-2.5 px-3 border-r border-blue-400/30 w-[32%] text-center">세부항목</th>
                      <th className="py-2.5 px-3 w-[42%] text-center">수량</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {plan.tableRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                        {/* 구분 column with rowSpan */}
                        {row.categoryRowSpan && row.categoryRowSpan > 0 && (
                          <td
                            rowSpan={row.categoryRowSpan}
                            className="py-2.5 px-3 font-semibold text-white/90 border-r border-white/10 text-center bg-white/[0.015] align-middle"
                          >
                            {row.category}
                          </td>
                        )}
                        {/* 세부항목 */}
                        <td className="py-2.5 px-3 text-white/70 border-r border-white/10 text-center align-middle font-medium">
                          {row.subItem || '-'}
                        </td>
                        {/* 수량 */}
                        <td className="py-2.5 px-3 text-white/90 text-center align-middle font-medium">
                          {row.quantity ? (
                            <span className="text-emerald-300/90 font-medium">{row.quantity}</span>
                          ) : (
                            <span className="text-white/20">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => onSelectPlan(plan.name)}
              className={`w-full py-4 rounded-2xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 ${
                plan.isPopular
                  ? 'bg-[#0A5C36] hover:bg-[#0c7042] text-white shadow-[0_10px_30px_rgba(10,92,54,0.3)]'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
              }`}
            >
              {plan.name} 견적 상담하기
              <ArrowRight size={17} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer Notes */}
      <div className="mt-8 text-center text-xs text-white/30 max-w-xl mx-auto leading-relaxed">
        * 모든 플랜 금액은 VAT 포함 기준이며, 클라이언트의 업종 및 촬영 성격에 따라 맞춤 구성 조율이 가능합니다.
      </div>
    </div>
  </section>
);

const ContactSection = ({ settings, initialMessage }: { settings: SiteSettings; initialMessage?: string | null }) => {
  const [hospitalName, setHospitalName] = useState('');
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [isOtherChecked, setIsOtherChecked] = useState(false);
  const [otherPackage, setOtherPackage] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone1, setPhone1] = useState('010');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  const [videoStyle, setVideoStyle] = useState('');
  const [memo, setMemo] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const phone2Ref = useRef<HTMLInputElement>(null);
  const phone3Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialMessage) {
      if (initialMessage.includes('플랜A') || initialMessage.includes('Plan A') || initialMessage.includes('스타터')) {
        setSelectedPackages(['Plan A (롱폼4, 숏폼4) - 275만 원']);
      } else if (initialMessage.includes('플랜B') || initialMessage.includes('Plan B')) {
        setSelectedPackages(['Plan B (롱폼4, 숏폼8) - 330만 원']);
      } else if (initialMessage.includes('플랜C') || initialMessage.includes('Plan C') || initialMessage.includes('프리미엄')) {
        setSelectedPackages(['Plan C (롱폼4, 숏폼8, 광고 운영) - 440만 원']);
      }
    }
  }, [initialMessage]);

  const togglePackage = (pkg: string) => {
    setSelectedPackages(prev => 
      prev.includes(pkg) ? prev.filter(p => p !== pkg) : [...prev, pkg]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!hospitalName.trim()) {
      e.preventDefault();
      alert('병원명을 입력해주세요.');
      return;
    }
    const hasPackage = selectedPackages.length > 0 || (isOtherChecked && otherPackage.trim().length > 0);
    if (!hasPackage) {
      e.preventDefault();
      alert('희망패키지를 하나 이상 선택해주세요.');
      return;
    }
    if (!contactPerson.trim()) {
      e.preventDefault();
      alert('담당자 성함을 입력해주세요.');
      return;
    }
    if (!phone1.trim() || !phone2.trim() || !phone3.trim()) {
      e.preventDefault();
      alert('연락처 3자리를 모두 입력해주세요.');
      return;
    }
    if (!privacyAgreed) {
      e.preventDefault();
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }
  };

  const combinedPackages = [
    ...selectedPackages,
    isOtherChecked && otherPackage.trim() ? `기타: ${otherPackage.trim()}` : (isOtherChecked ? '기타' : '')
  ].filter(Boolean).join(', ');

  return (
    <section id="contact" className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
        {/* Left Side: Text & Info */}
        <div className="lg:w-5/12 flex flex-col justify-between space-y-12 lg:sticky lg:top-32">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              프로젝트를 함께<br />시작해볼까요?
            </h2>
          </div>

          <div className="space-y-6">
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

        {/* Right Side: Exact Form from Attached Image */}
        <div className="lg:w-7/12 w-full">
          <form 
            action="https://formspree.io/f/mojkjdwq" 
            method="POST"
            onSubmit={handleSubmit}
            className="space-y-7"
          >
            {/* Hidden inputs to format Formspree email submission cleanly */}
            <input type="hidden" name="병원명" value={hospitalName} />
            <input type="hidden" name="희망패키지" value={combinedPackages} />
            <input type="hidden" name="담당자 성함" value={contactPerson} />
            <input type="hidden" name="연락처" value={`${phone1}-${phone2}-${phone3}`} />
            <input type="hidden" name="희망하는 영상 스타일" value={videoStyle} />
            <input type="hidden" name="남기고 싶은 메모" value={memo} />
            <input type="hidden" name="개인정보수집 동의" value={privacyAgreed ? '동의함' : '미동의'} />

            {/* 1. 병원명 • */}
            <div className="space-y-2">
              <label className="text-[15px] font-medium text-white flex items-center">
                병원명 <span className="text-[#E05656] ml-1 text-sm font-bold">•</span>
              </label>
              <input 
                type="text" 
                name="raw_hospital"
                required
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-md px-4 py-3 text-white text-sm focus:border-white outline-none transition-colors"
              />
            </div>

            {/* 2. 희망패키지 • */}
            <div className="space-y-3">
              <label className="text-[15px] font-medium text-white flex items-center">
                희망패키지 <span className="text-[#E05656] ml-1 text-sm font-bold">•</span>
              </label>
              <div className="space-y-3 pt-0.5">
                {[
                  'Plan A (롱폼4, 숏폼4) - 275만 원',
                  'Plan B (롱폼4, 숏폼8) - 330만 원',
                  'Plan C (롱폼4, 숏폼8, 광고 운영) - 440만 원',
                ].map((pkg) => {
                  const isChecked = selectedPackages.includes(pkg);
                  return (
                    <div 
                      key={pkg} 
                      onClick={() => togglePackage(pkg)}
                      className="flex items-center gap-3 cursor-pointer select-none text-[15px] text-white font-medium group"
                    >
                      <div className={`w-[22px] h-[22px] rounded-[5px] border flex items-center justify-center transition-colors flex-shrink-0 ${
                        isChecked ? 'bg-white border-white text-black' : 'border-white/40 bg-transparent group-hover:border-white'
                      }`}>
                        {isChecked && <Check size={14} className="stroke-[3]" />}
                      </div>
                      <span>{pkg}</span>
                    </div>
                  );
                })}

                {/* 기타: + 직접입력 box */}
                <div className="space-y-2 pt-0.5">
                  <div 
                    onClick={() => setIsOtherChecked(!isOtherChecked)}
                    className="flex items-center gap-3 cursor-pointer select-none text-[15px] text-white font-medium group"
                  >
                    <div className={`w-[22px] h-[22px] rounded-[5px] border flex items-center justify-center transition-colors flex-shrink-0 ${
                      isOtherChecked ? 'bg-white border-white text-black' : 'border-white/40 bg-transparent group-hover:border-white'
                    }`}>
                      {isOtherChecked && <Check size={14} className="stroke-[3]" />}
                    </div>
                    <span>기타:</span>
                  </div>
                  <div className="pl-[34px]">
                    <input 
                      type="text"
                      placeholder="직접입력"
                      value={otherPackage}
                      onChange={(e) => {
                        setOtherPackage(e.target.value);
                        if (!isOtherChecked && e.target.value) setIsOtherChecked(true);
                      }}
                      className="w-full max-w-[340px] bg-black border border-white/20 rounded-md px-4 py-2.5 text-white text-sm focus:border-white outline-none transition-colors placeholder:text-white/30"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 담당자 성함 • */}
            <div className="space-y-2">
              <label className="text-[15px] font-medium text-white flex items-center">
                담당자 성함 <span className="text-[#E05656] ml-1 text-sm font-bold">•</span>
              </label>
              <input 
                type="text" 
                name="raw_name"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-md px-4 py-3 text-white text-sm focus:border-white outline-none transition-colors"
              />
            </div>

            {/* 4. 연락처 • (3 separate compact inputs) */}
            <div className="space-y-2">
              <label className="text-[15px] font-medium text-white flex items-center">
                연락처 <span className="text-[#E05656] ml-1 text-sm font-bold">•</span>
              </label>
              <div className="flex items-center gap-2.5">
                <input 
                  type="tel"
                  maxLength={4}
                  required
                  value={phone1}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setPhone1(val);
                    if (val.length >= 3) phone2Ref.current?.focus();
                  }}
                  className="w-20 sm:w-24 bg-black border border-white/20 rounded-md px-3 py-3 text-white text-center text-sm focus:border-white outline-none transition-colors"
                />
                <input 
                  ref={phone2Ref}
                  type="tel"
                  maxLength={4}
                  required
                  value={phone2}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setPhone2(val);
                    if (val.length >= 4) phone3Ref.current?.focus();
                  }}
                  className="w-24 sm:w-28 bg-black border border-white/20 rounded-md px-3 py-3 text-white text-center text-sm focus:border-white outline-none transition-colors"
                />
                <input 
                  ref={phone3Ref}
                  type="tel"
                  maxLength={4}
                  required
                  value={phone3}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setPhone3(val);
                  }}
                  className="w-24 sm:w-28 bg-black border border-white/20 rounded-md px-3 py-3 text-white text-center text-sm focus:border-white outline-none transition-colors"
                />
              </div>
            </div>

            {/* 5. 희망하는 영상 스타일 (레퍼런스가 있으신 경우 링크를 남겨주세요) */}
            <div className="space-y-2">
              <label className="text-[15px] font-medium text-white block">
                희망하는 영상 스타일 (레퍼런스가 있으신 경우 링크를 남겨주세요)
              </label>
              <input 
                type="text"
                name="raw_video_style"
                value={videoStyle}
                onChange={(e) => setVideoStyle(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-md px-4 py-3 text-white text-sm focus:border-white outline-none transition-colors"
              />
            </div>

            {/* 6. 남기고 싶은 메모 (예 : 상담은 오후 2시 이후 가능) */}
            <div className="space-y-2">
              <label className="text-[15px] font-medium text-white block">
                남기고 싶은 메모 (예 : 상담은 오후 2시 이후 가능)
              </label>
              <input 
                type="text"
                name="raw_memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-md px-4 py-3 text-white text-sm focus:border-white outline-none transition-colors"
              />
            </div>

            {/* 7. 개인정보수집 동의 • */}
            <div className="space-y-2 pt-2">
              <label className="text-[15px] font-medium text-white flex items-center">
                개인정보수집 동의 <span className="text-[#E05656] ml-1 text-sm font-bold">•</span>
              </label>
              <div className="flex items-center gap-3 select-none text-[15px] text-white">
                <div 
                  onClick={() => setPrivacyAgreed(!privacyAgreed)}
                  className={`w-[22px] h-[22px] rounded-[5px] border flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
                    privacyAgreed ? 'bg-white border-white text-black' : 'border-white/40 bg-transparent hover:border-white'
                  }`}
                >
                  {privacyAgreed && <Check size={14} className="stroke-[3]" />}
                </div>
                <span>
                  <strong className="font-bold">(필수)</strong>{' '}
                  <button 
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="underline hover:text-white/80 cursor-pointer font-bold inline"
                  >
                    개인정보 수집 및 이용
                  </button>
                  에 동의합니다.
                </span>
              </div>
            </div>

            {/* 8. 작성 버튼 (Centered submit button) */}
            <div className="pt-6 flex justify-center">
              <button 
                type="submit"
                className="w-48 sm:w-56 py-3 bg-black border border-white text-white text-sm font-medium tracking-wider hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer"
              >
                작성
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowPrivacyModal(false)}
        >
          <div 
            className="bg-[#121212] border border-white/20 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold">개인정보 수집 및 이용 동의</h3>
              <button 
                type="button" 
                onClick={() => setShowPrivacyModal(false)}
                className="text-white/50 hover:text-white p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="text-xs text-white/70 space-y-2.5 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <p><strong>1. 수집 항목:</strong> 병원명, 희망 패키지, 담당자 성함, 연락처, 희망 영상 스타일, 메모</p>
              <p><strong>2. 수집 목적:</strong> 병원 유튜브 채널 맞춤 견적 산정 및 상담 연락</p>
              <p><strong>3. 보유 기간:</strong> 문의 접수일로부터 1년간 보관 후 지체 없이 안전하게 파기</p>
              <p><strong>4. 동의 거부권:</strong> 개인정보 수집 및 이용 동의를 거부하실 수 있으나, 미동의 시 상담 및 견적 안내가 제한될 수 있습니다.</p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setPrivacyAgreed(true);
                  setShowPrivacyModal(false);
                }}
                className="px-5 py-2 bg-white text-black font-bold text-xs rounded-lg hover:bg-white/90 transition-all cursor-pointer"
              >
                동의하고 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const Footer = ({ 
  settings, 
  onContactClick 
}: { 
  settings: SiteSettings; 
  onContactClick?: () => void;
}) => {
  const [contactClickCount, setContactClickCount] = useState(0);

  const handleContactClick = () => {
    const next = contactClickCount + 1;
    setContactClickCount(next);
    if (next >= 5) {
      setContactClickCount(0);
      if (onContactClick) {
        onContactClick();
      }
    }
    setTimeout(() => setContactClickCount(0), 2000);
  };

  return (
    <footer className="py-20 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div>
          <p className="text-white/40 max-w-sm mb-8 leading-relaxed">
            우리는 단순한 영상 제작을 넘어, 브랜드의 본질을 담아내는 시각적 예술을 지향합니다.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-16">
          <div>
            <h4 
              onClick={handleContactClick}
              className="font-bold mb-6 text-sm tracking-widest cursor-pointer select-none hover:text-white transition-colors"
              title="CONTACT"
            >
              CONTACT
            </h4>
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
};

// --- Admin Components ---

const getYoutubeThumbnail = (url: string) => {
  const id = getYoutubeId(url);
  if (id) {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
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

  const handlePortfolioLinkChange = async (id: string, url: string) => {
    const thumbnail = getYoutubeThumbnail(url);
    onUpdatePortfolio(id, { video_url: url, thumbnail });
    const realTitle = await fetchYoutubeTitle(url);
    if (realTitle) {
      onUpdatePortfolio(id, { title: realTitle });
    }
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
                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">
                      메인 배경 영상 URL (동영상 파일 경로 또는 유튜브 링크)
                    </label>
                    <input 
                      type="text" 
                      value={localSettings.hero_video_url || ''}
                      placeholder="/hero-video.mp4 또는 https://youtube.com/watch?v=..."
                      onChange={e => handleChange({ hero_video_url: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all font-mono text-sm"
                    />
                    <p className="text-xs text-white/40">
                      * 로컬 영상 파일을 직접 사용하시려면 프로젝트의 <span className="text-[#0A5C36] font-mono font-bold">public/hero-video.mp4</span> 경로에 파일을 넣으시면 자동으로 무한 반복 재생됩니다. 또는 유튜브 링크나 온라인 MP4 링크를 입력하셔도 됩니다.
                    </p>
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
                      placeholder="시술 정보, 트렌드/이슈, 원장님 토크, 리얼 후기"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#0A5C36] outline-none transition-all"
                    />
                    <p className="text-[10px] text-white/20 leading-relaxed">
                      * 카테고리를 추가하거나 삭제한 후 반드시 '카테고리 저장' 버튼을 눌러주세요.<br />
                      * 포트폴리오 섹션의 상단 필터 탭에 즉시 반영됩니다.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-bold">포트폴리오 관리</h2>
                      <p className="text-white/40 text-sm mt-1">
                        상단 메인 2×3 그리드(<span className="text-[#0A5C36] font-bold">최대 6개</span>)와 
                        하단 우에서 좌로 흘러가는 영상(<span className="text-amber-400 font-bold">하단 롤링</span>)을 각각 선택하여 관리할 수 있습니다.
                      </p>
                    </div>
                    <button 
                      onClick={() => onAddPortfolio({
                        title: '새로운 프로젝트',
                        description: '',
                        thumbnail: 'https://picsum.photos/seed/new/800/450',
                        video_url: '',
                        category: (settings.categories || '시술 정보').split(',')[0].trim(),
                        is_featured: 0,
                        is_ticker: 1
                      })}
                      className="flex items-center gap-2 px-6 py-3 bg-[#0A5C36] rounded-full font-bold hover:bg-[#0c7042] transition-all cursor-pointer"
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
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                              {item.is_featured === 1 && (
                                <div className="px-2.5 py-0.5 bg-[#0A5C36] text-white text-[10px] font-bold rounded-full shadow-lg">
                                  메인 6개 노출
                                </div>
                              )}
                              {(item.is_ticker === 1 || item.is_ticker === (true as any)) && (
                                <div className="px-2.5 py-0.5 bg-amber-500 text-black text-[10px] font-bold rounded-full shadow-lg">
                                  하단 롤링 노출
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">제목</label>
                                    {item.video_url && (
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          const title = await fetchYoutubeTitle(item.video_url);
                                          if (title) {
                                            onUpdatePortfolio(item.id, { title });
                                          }
                                        }}
                                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                                      >
                                        <RefreshCw size={10} /> 실제 유튜브 제목 적용
                                      </button>
                                    )}
                                  </div>
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
                                    {(settings.categories || '시술 정보,트렌드/이슈,원장님 토크,리얼 후기').split(',').map(cat => (
                                      <option key={cat.trim()} value={cat.trim()}>{cat.trim()}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <button 
                                  onClick={() => onUpdatePortfolio(item.id, { is_featured: item.is_featured ? 0 : 1 })}
                                  className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                                    item.is_featured 
                                      ? 'bg-[#0A5C36] border-[#0A5C36] text-white shadow-sm' 
                                      : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                                  }`}
                                >
                                  <Check size={13} className={item.is_featured ? 'opacity-100' : 'opacity-0'} />
                                  {item.is_featured ? '메인 6개 노출 중' : '메인 6개 노출'}
                                </button>

                                <button 
                                  onClick={() => onUpdatePortfolio(item.id, { is_ticker: (item.is_ticker === 1 || item.is_ticker === (true as any)) ? 0 : 1 })}
                                  className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                                    (item.is_ticker === 1 || item.is_ticker === (true as any))
                                      ? 'bg-amber-500/20 border-amber-500/80 text-amber-300' 
                                      : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                                  }`}
                                >
                                  <Sparkles size={13} />
                                  {(item.is_ticker === 1 || item.is_ticker === (true as any)) ? '하단 롤링 노출 중' : '하단 롤링 노출'}
                                </button>
                              </div>
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
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: "제로원프로덕션",
    hero_title: "세상을 바꾸는 단 하나의 영상\n제로원프로덕션",
    hero_subtitle: "최고의 퀄리티로 당신의 브랜드 가치를 높여드립니다.",
    hero_video_url: "/hero-video.mp4",
    primary_color: "#0A5C36",
    bg_color: "#000000",
    contact_email: "contact@zeroone.pro",
    contact_phone: "010-7788-9757",
    contact_address: "서울특별시 마포구 월드컵북로 179, 208호",
    youtube_url: "https://youtube.com/@zeroone",
    instagram_url: "https://instagram.com/zeroone",
    categories: "시술 정보,트렌드/이슈,원장님 토크,리얼 후기"
  });
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdminAccess, setShowAdminAccess] = useState(false);

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
        const initialPortfolios = DEFAULT_PORTFOLIOS.map(p => ({
          title: p.title,
          description: p.description,
          thumbnail: p.thumbnail,
          video_url: p.video_url,
          category: p.category || '시술 정보',
          is_featured: p.is_featured,
          is_ticker: p.is_ticker || 1,
          created_at: serverTimestamp()
        }));
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
              <PricingSection onSelectPlan={(plan) => {
                setSelectedPlan(plan);
                setTimeout(() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 50);
              }} />
              <ContactSection settings={settings} initialMessage={selectedPlan} />
            </>
          )}
        </main>

        <Footer 
          settings={settings} 
          onContactClick={() => {
            setShowAdminAccess(true);
            setIsAdmin(true);
          }}
        />
      </div>
    </ErrorBoundary>
  );
}
