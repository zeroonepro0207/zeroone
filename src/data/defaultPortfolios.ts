// Default portfolio items matching the real medical/YouTube portfolio showcase
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  video_url: string;
  category?: string;
  is_featured: number;
  is_ticker?: number;
}

const createSvgThumbnail = (svgContent: string): string => {
  const fullSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.8"/>
        </filter>
        <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.9"/>
        </filter>
      </defs>
      ${svgContent}
    </svg>
  `.trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(fullSvg)}`;
};

// 1. 울써마지 대체품 (채정안 pick, 요즘 연예인들은 울쎄라 써마지 안해요)
const thumb1 = createSvgThumbnail(`
  <rect width="800" height="450" fill="#120c16"/>
  <!-- Studio lighting gradient -->
  <circle cx="250" cy="200" r="280" fill="#3a1835" opacity="0.6"/>
  <circle cx="650" cy="220" r="240" fill="#1e1842" opacity="0.7"/>
  
  <!-- Left person avatar shape -->
  <g transform="translate(100, 70)">
    <circle cx="80" cy="80" r="65" fill="#e8c4b8"/>
    <path d="M20,260 C20,160 60,140 80,140 C100,140 140,160 140,260 Z" fill="#2d2226"/>
    <!-- Hair overlay -->
    <path d="M15,80 C15,20 145,20 145,80 C145,130 135,160 135,160 C120,100 40,100 25,160 Z" fill="#1e1215"/>
  </g>
  
  <!-- Right person avatar shape (with glasses) -->
  <g transform="translate(560, 80)">
    <circle cx="80" cy="80" r="60" fill="#f0cdc2"/>
    <path d="M20,250 C20,160 60,140 80,140 C100,140 140,160 140,250 Z" fill="#1a1c24"/>
    <path d="M10,80 C10,15 150,15 150,80 C150,150 140,180 140,180 C120,95 40,95 20,180 Z" fill="#0d0e12"/>
    <!-- Glasses -->
    <rect x="42" y="65" width="32" height="22" rx="4" fill="none" stroke="#000" stroke-width="4"/>
    <rect x="86" y="65" width="32" height="22" rx="4" fill="none" stroke="#000" stroke-width="4"/>
    <line x1="74" y1="76" x2="86" y2="76" stroke="#000" stroke-width="4"/>
  </g>

  <!-- Speech tags -->
  <g transform="translate(80, 50)" filter="url(#shadow)">
    <rect width="180" height="42" rx="21" fill="#FFE500"/>
    <text x="90" y="27" font-family="'Pretendard', sans-serif" font-weight="900" font-size="20" fill="#000" text-anchor="middle">채정안 pick은?</text>
  </g>
  <g transform="translate(520, 50)" filter="url(#shadow)">
    <rect width="220" height="42" rx="21" fill="#FFFFFF" opacity="0.9"/>
    <text x="110" y="26" font-family="'Pretendard', sans-serif" font-weight="800" font-size="16" fill="#111" text-anchor="middle">울쎄라 부작용 송지효님...</text>
  </g>

  <!-- Big impact headline -->
  <g transform="translate(400, 290)" text-anchor="middle" filter="url(#textGlow)">
    <text x="0" y="0" font-family="'Pretendard', 'Apple SD Gothic Neo', sans-serif" font-weight="900" font-size="52" fill="#FFFFFF" stroke="#000000" stroke-width="8" paint-order="stroke fill">
      요즘 연예인들은
    </text>
    <text x="0" y="72" font-family="'Pretendard', 'Apple SD Gothic Neo', sans-serif" font-weight="900" font-size="58" fill="#4EFAAA" stroke="#000000" stroke-width="10" paint-order="stroke fill">
      울쎄라, 써마지 안해요...
    </text>
  </g>
`);

// 2. 쥬베룩 안 하는 이유 (닥터 지훈)
const thumb2 = createSvgThumbnail(`
  <rect width="800" height="450" fill="#070c14"/>
  <!-- Dark clinical background -->
  <circle cx="400" cy="200" r="300" fill="#0b2444" opacity="0.6"/>
  
  <!-- Left Juvelook Bottle Graphic -->
  <g transform="translate(110, 110)" filter="url(#shadow)">
    <rect x="25" y="0" width="30" height="20" rx="3" fill="#cfd6df"/>
    <rect x="0" y="20" width="80" height="130" rx="10" fill="#f8fafc"/>
    <rect x="10" y="45" width="60" height="65" fill="#e2e8f0"/>
    <text x="40" y="82" font-family="sans-serif" font-weight="900" font-size="13" fill="#0f172a" text-anchor="middle">JUVELOOK</text>
  </g>

  <!-- Right Juvelook Bottle Graphic -->
  <g transform="translate(610, 110)" filter="url(#shadow)">
    <rect x="25" y="0" width="30" height="20" rx="3" fill="#cfd6df"/>
    <rect x="0" y="20" width="80" height="130" rx="10" fill="#f8fafc"/>
    <rect x="10" y="45" width="60" height="65" fill="#e2e8f0"/>
    <text x="40" y="82" font-family="sans-serif" font-weight="900" font-size="13" fill="#0f172a" text-anchor="middle">JUVELOOK</text>
  </g>

  <!-- Doctor avatar center -->
  <g transform="translate(330, 85)">
    <circle cx="70" cy="70" r="55" fill="#f4cfc4"/>
    <path d="M15,220 C15,140 45,130 70,130 C95,130 125,140 125,220 Z" fill="#1b2536"/>
    <path d="M15,70 C15,20 125,20 125,70 C125,90 120,110 120,110 C90,80 50,80 20,110 Z" fill="#0f172a"/>
  </g>

  <!-- Top-left Badge: 닥터 지훈 -->
  <g transform="translate(60, 45)" filter="url(#shadow)">
    <rect width="140" height="42" rx="8" fill="#0084FF"/>
    <text x="70" y="28" font-family="'Pretendard', sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle">닥터 지훈</text>
  </g>

  <!-- Subtitle and Big Headline -->
  <g transform="translate(400, 310)" text-anchor="middle" filter="url(#textGlow)">
    <text x="0" y="0" font-family="'Pretendard', sans-serif" font-weight="800" font-size="34" fill="#FF3B30" stroke="#000" stroke-width="6" paint-order="stroke fill">
      (저는 쥬베룩 안 해요)
    </text>
    <text x="0" y="68" font-family="'Pretendard', sans-serif" font-weight="900" font-size="54" fill="#FFFFFF" stroke="#000" stroke-width="10" paint-order="stroke fill">
      쥬베룩 안 하는 <tspan fill="#FFE600">27가지</tspan> 이유
    </text>
  </g>
`);

// 3. 스킨보톡스의 모든 것 (총정리편)
const thumb3 = createSvgThumbnail(`
  <rect width="800" height="450" fill="#F8F6F2"/>
  <!-- Warm glow -->
  <circle cx="400" cy="225" r="320" fill="#F2ECE4" opacity="0.9"/>
  <circle cx="400" cy="200" r="180" fill="#FFF8F0"/>

  <!-- Top Decorative Header -->
  <g transform="translate(400, 65)" text-anchor="middle">
    <text x="0" y="0" font-family="'Pretendard', serif" font-weight="900" font-size="44" fill="#1C1917" letter-spacing="4">
      ✦ &lt;스킨보톡스&gt; ✦
    </text>
    <line x1="-220" y1="18" x2="220" y2="18" stroke="#1C1917" stroke-width="2" stroke-dasharray="8 6"/>
  </g>

  <!-- Forehead Treatment Illustration -->
  <g transform="translate(320, 110)">
    <!-- Face silhouette -->
    <path d="M0,170 C0,70 40,40 80,40 C120,40 160,70 160,170 Z" fill="#fae1d6"/>
    <!-- Eyebrows and eyes -->
    <path d="M30,130 Q50,120 70,130" stroke="#443" stroke-width="4" fill="none"/>
    <path d="M90,130 Q110,120 130,130" stroke="#443" stroke-width="4" fill="none"/>
    <!-- Red injection dots on forehead -->
    <circle cx="45" cy="85" r="5" fill="#EF4444"/>
    <circle cx="80" cy="75" r="5" fill="#EF4444"/>
    <circle cx="115" cy="85" r="5" fill="#EF4444"/>
    <circle cx="60" cy="100" r="4" fill="#EF4444"/>
    <circle cx="100" cy="100" r="4" fill="#EF4444"/>
    <!-- Syringe -->
    <g transform="translate(120, 30) rotate(-35)">
      <rect x="0" y="10" width="14" height="60" rx="3" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/>
      <line x1="7" y1="70" x2="7" y2="95" stroke="#94A3B8" stroke-width="3"/>
      <rect x="-4" y="0" width="22" height="10" fill="#94A3B8"/>
    </g>
  </g>

  <!-- Center Tag & Bottom Headline -->
  <g transform="translate(400, 320)" text-anchor="middle">
    <text x="0" y="0" font-family="'Pretendard', sans-serif" font-weight="700" font-size="28" fill="#57534E">
      (feat. 셀프시술, real 후기)
    </text>
    <g transform="translate(0, 52)" filter="url(#shadow)">
      <text x="0" y="0" font-family="'Pretendard', sans-serif" font-weight="900" font-size="62" fill="#1C1917" stroke="#FFFFFF" stroke-width="6" paint-order="stroke fill">
        총정리편
      </text>
    </g>
  </g>
`);

// 4. 잡티 치료 호갱 안되는 방법 (바노바기)
const thumb4 = createSvgThumbnail(`
  <rect width="800" height="450" fill="#EDE7DF"/>
  <circle cx="200" cy="200" r="260" fill="#E2D9CE" opacity="0.8"/>
  <circle cx="680" cy="220" r="220" fill="#E6DDD2" opacity="0.9"/>

  <!-- Top Banner -->
  <g transform="translate(50, 45)">
    <text x="0" y="0" font-family="sans-serif" font-weight="900" font-size="24" fill="#6B2D38" letter-spacing="2">BANOBAGI</text>
    <text x="0" y="18" font-family="sans-serif" font-weight="600" font-size="12" fill="#888">Dermatologic Clinic</text>
  </g>

  <!-- Left: Skin close up & Honeycomb graphic -->
  <g transform="translate(80, 100)">
    <circle cx="100" cy="100" r="85" fill="#f8e4d8"/>
    <!-- Honeycomb hex -->
    <g transform="translate(130, 70)" stroke="#B45309" stroke-width="3" fill="none" opacity="0.7">
      <polygon points="20,0 40,11 40,34 20,45 0,34 0,11"/>
      <polygon points="55,20 75,31 75,54 55,65 35,54 35,31"/>
      <polygon points="20,40 40,51 40,74 20,85 0,74 0,51"/>
    </g>
    <!-- Tag -->
    <rect x="100" y="15" width="160" height="32" rx="6" fill="#4B242C"/>
    <text x="180" y="36" font-family="'Pretendard', sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" text-anchor="middle">정확히 알고! 제대로 관리하자!</text>
  </g>

  <!-- Right: Doctor pointing -->
  <g transform="translate(560, 120)">
    <circle cx="65" cy="65" r="55" fill="#f5d3c8"/>
    <path d="M10,210 C10,130 40,120 65,120 C90,120 120,130 120,210 Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3"/>
    <!-- Stethoscope -->
    <path d="M40,140 Q65,175 90,140" stroke="#475569" stroke-width="5" fill="none"/>
    <path d="M10,65 C10,15 120,15 120,65 C120,85 110,105 110,105 C85,75 45,75 15,105 Z" fill="#6B4226"/>
  </g>

  <!-- Big Red Box Headline -->
  <g transform="translate(50, 310)" filter="url(#shadow)">
    <rect width="460" height="42" rx="6" fill="#4A1E26"/>
    <text x="230" y="29" font-family="'Pretendard', sans-serif" font-weight="800" font-size="22" fill="#FFFFFF" text-anchor="middle">
      피부과전문의가 알려주는
    </text>
    <rect y="48" width="460" height="60" rx="8" fill="#6E2331"/>
    <text x="230" y="93" font-family="'Pretendard', sans-serif" font-weight="900" font-size="40" fill="#FFFFFF" text-anchor="middle">
      피부 잡티 관리법
    </text>
  </g>
`);

// 5. 은근 여자들이 많이 보는 남자들의 그 부위
const thumb5 = createSvgThumbnail(`
  <rect width="800" height="450" fill="#1C1814"/>
  <!-- Sunny beach background -->
  <rect x="0" y="0" width="800" height="240" fill="#5BB5D9"/>
  <rect x="0" y="200" width="800" height="250" fill="#DFBE8B"/>

  <!-- Athletic shirtless men in background -->
  <g transform="translate(180, 80)" opacity="0.6">
    <path d="M10,140 C10,50 30,30 50,30 C70,30 90,50 90,140 Z" fill="#C28D66"/>
    <circle cx="50" cy="20" r="16" fill="#C28D66"/>
  </g>
  <g transform="translate(540, 80)" opacity="0.6">
    <path d="M10,140 C10,50 30,30 50,30 C70,30 90,50 90,140 Z" fill="#C28D66"/>
    <circle cx="50" cy="20" r="16" fill="#C28D66"/>
  </g>

  <!-- Center Female Doctor in White Coat -->
  <g transform="translate(340, 95)" filter="url(#shadow)">
    <circle cx="60" cy="55" r="48" fill="#FCE0D4"/>
    <path d="M0,230 C0,130 30,110 60,110 C90,110 120,130 120,230 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <path d="M5,55 C5,10 115,10 115,55 C115,130 100,160 100,160 C80,90 40,90 20,160 Z" fill="#4B2C20"/>
  </g>

  <!-- Big Dark Box Headline -->
  <g transform="translate(50, 270)" filter="url(#shadow)">
    <rect width="700" height="140" rx="14" fill="#0A0A0A" opacity="0.94"/>
    <text x="350" y="52" font-family="'Pretendard', sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle">
      은근 여자들이 많이 보는
    </text>
    <text x="350" y="112" font-family="'Pretendard', sans-serif" font-weight="900" font-size="52" fill="#FFFFFF" text-anchor="middle">
      남자들의 <tspan fill="#00F0FF">“그 부위”</tspan>
    </text>
  </g>
`);

// 6. 입술필러 트렌드
const thumb6 = createSvgThumbnail(`
  <rect width="800" height="450" fill="#201016"/>
  <circle cx="200" cy="200" r="280" fill="#4A1828" opacity="0.7"/>
  <circle cx="650" cy="220" r="240" fill="#301524" opacity="0.8"/>

  <!-- Left: Glossy lips illustration -->
  <g transform="translate(100, 100)">
    <circle cx="100" cy="100" r="95" fill="#f6d3ce"/>
    <!-- Plump lips -->
    <path d="M40,105 Q70,75 100,90 Q130,75 160,105 Q100,145 40,105 Z" fill="#E11D48"/>
    <path d="M40,105 Q100,100 160,105 Q100,140 40,105 Z" fill="#FB7185" opacity="0.8"/>
    <!-- Gloss reflection -->
    <ellipse cx="85" cy="100" rx="16" ry="6" fill="#FFFFFF" opacity="0.6"/>
  </g>

  <!-- Right: Doctor talking -->
  <g transform="translate(570, 90)">
    <circle cx="65" cy="65" r="55" fill="#f4cfc4"/>
    <path d="M10,210 C10,130 40,120 65,120 C90,120 120,130 120,210 Z" fill="#1e293b"/>
    <path d="M10,65 C10,15 120,15 120,65 C120,80 115,95 115,95 C90,75 50,75 15,95 Z" fill="#0f172a"/>
  </g>

  <!-- Speech bubble -->
  <g transform="translate(480, 50)" filter="url(#shadow)">
    <rect width="260" height="42" rx="21" fill="#FFFFFF"/>
    <text x="130" y="27" font-family="'Pretendard', sans-serif" font-weight="900" font-size="18" fill="#111" text-anchor="middle">환자들이 이것만 해달래요!</text>
  </g>

  <!-- Big impact typography -->
  <g transform="translate(120, 290)" filter="url(#textGlow)">
    <text x="0" y="70" font-family="'Pretendard', sans-serif" font-weight="900" font-size="64" fill="#00E5FF" stroke="#000" stroke-width="10" paint-order="stroke fill">
      입술필러
    </text>
    <text x="240" y="70" font-family="'Pretendard', sans-serif" font-weight="900" font-size="64" fill="#FFDF00" stroke="#000" stroke-width="10" paint-order="stroke fill">
      트렌드!
    </text>
  </g>
`);

// Carousel Items
const thumb_lifting = createSvgThumbnail(`
  <rect width="800" height="450" fill="#18181B"/>
  <rect x="50" y="40" width="700" height="370" rx="16" fill="#27272A"/>
  <text x="400" y="100" font-family="'Pretendard', sans-serif" font-weight="900" font-size="38" fill="#FFE500" text-anchor="middle">
    10분 만에 10살 어려지기
  </text>
  <text x="400" y="145" font-family="'Pretendard', sans-serif" font-weight="700" font-size="22" fill="#FFFFFF" text-anchor="middle">
    #민트실 리프팅 #팔자주름
  </text>
  <!-- Before / After Frames -->
  <g transform="translate(140, 180)">
    <rect width="220" height="180" rx="10" fill="#3F3F46" stroke="#22C55E" stroke-width="4"/>
    <text x="110" y="100" font-family="sans-serif" font-weight="800" font-size="26" fill="#FFF" text-anchor="middle">BEFORE</text>
  </g>
  <g transform="translate(440, 180)">
    <rect width="220" height="180" rx="10" fill="#3F3F46" stroke="#22C55E" stroke-width="4"/>
    <text x="110" y="100" font-family="sans-serif" font-weight="800" font-size="26" fill="#FFF" text-anchor="middle">AFTER</text>
  </g>
`);

const thumb_oligio = createSvgThumbnail(`
  <rect width="800" height="450" fill="#1E1428"/>
  <circle cx="400" cy="225" r="300" fill="#3B1D4A" opacity="0.8"/>
  <text x="400" y="140" font-family="'Pretendard', sans-serif" font-weight="800" font-size="34" fill="#FFFFFF" text-anchor="middle">
    여의사가 직접 받아보는
  </text>
  <text x="400" y="240" font-family="'Pretendard', sans-serif" font-weight="900" font-size="74" fill="#FF4081" stroke="#000" stroke-width="8" paint-order="stroke fill" text-anchor="middle">
    올리지오
  </text>
  <text x="400" y="320" font-family="'Pretendard', sans-serif" font-weight="900" font-size="64" fill="#FFD700" stroke="#000" stroke-width="8" paint-order="stroke fill" text-anchor="middle">
    600샷
  </text>
`);

const thumb_ultracol = createSvgThumbnail(`
  <rect width="800" height="450" fill="#0F172A"/>
  <circle cx="200" cy="225" r="260" fill="#1E293B"/>
  <circle cx="600" cy="225" r="260" fill="#1E293B"/>
  <text x="400" y="150" font-family="'Pretendard', sans-serif" font-weight="800" font-size="36" fill="#94A3B8" text-anchor="middle">
    내돈내산 솔직후기
  </text>
  <text x="400" y="260" font-family="'Pretendard', sans-serif" font-weight="900" font-size="68" fill="#38BDF8" stroke="#000" stroke-width="8" paint-order="stroke fill" text-anchor="middle">
    울트라콜 200
  </text>
  <text x="400" y="330" font-family="'Pretendard', sans-serif" font-weight="800" font-size="32" fill="#F8FAFC" text-anchor="middle">
    눈밑 꺼짐 3개월 변화
  </text>
`);

const thumb_doctor_tips = createSvgThumbnail(`
  <rect width="800" height="450" fill="#2E1065"/>
  <circle cx="400" cy="225" r="300" fill="#4C1D95" opacity="0.8"/>
  <text x="400" y="150" font-family="'Pretendard', sans-serif" font-weight="800" font-size="34" fill="#E9D5FF" text-anchor="middle">
    피부과 전문의가 추천하는
  </text>
  <text x="400" y="260" font-family="'Pretendard', sans-serif" font-weight="900" font-size="62" fill="#A855F7" stroke="#000" stroke-width="8" paint-order="stroke fill" text-anchor="middle">
    연예인 시술 BEST 5
  </text>
  <text x="400" y="330" font-family="'Pretendard', sans-serif" font-weight="700" font-size="26" fill="#DDD6FE" text-anchor="middle">
    촬영 직전 받는 시술 총정리
  </text>
`);

export const DEFAULT_PORTFOLIOS: PortfolioItem[] = [
  {
    id: 'portfolio-1',
    title: '연예인들도 선호하는 울써마지 대체품 🥰❤️',
    description: '채정안 pick! 요즘 연예인들은 울쎄라, 써마지 안해요',
    thumbnail: thumb1,
    video_url: 'https://www.youtube.com/watch?v=FjHGpYyW78Q',
    category: '트렌드/이슈',
    is_featured: 1,
    is_ticker: 1
  },
  {
    id: 'portfolio-2',
    title: '쥬베룩 안 하는 이유 #쥬베룩부작용 #쥬베룩사고 #피부과비추천',
    description: '닥터 지훈 (저는 쥬베룩 안 해요) 쥬베룩 안 하는 27가지 이유',
    thumbnail: thumb2,
    video_url: 'https://www.youtube.com/watch?v=M5GgB24z5Rk',
    category: '시술 정보',
    is_featured: 1,
    is_ticker: 1
  },
  {
    id: 'portfolio-3',
    title: '[ENG/JPN]스킨보톡스의 모든 것! 🥺 돈 안 아깝게 잘 받는 법 알려드립니다🧡',
    description: '<스킨보톡스> (feat. 셀프시술, real 후기) 총정리편',
    thumbnail: thumb3,
    video_url: 'https://www.youtube.com/watch?v=Qv-8_vD8n6s',
    category: '시술 정보',
    is_featured: 1,
    is_ticker: 1
  },
  {
    id: 'portfolio-4',
    title: '피부과 가서 잡티 치료 호갱 안되는 방법!!(기미,주근깨,오타모반,흑자)',
    description: 'BANOBAGI Dermatologic Clinic 피부과전문의가 알려주는 피부 잡티 관리법',
    thumbnail: thumb4,
    video_url: 'https://www.youtube.com/watch?v=b0S2HkWzY7c',
    category: '시술 정보',
    is_featured: 1,
    is_ticker: 1
  },
  {
    id: 'portfolio-5',
    title: '여기 색깔 어두우면 진짜… 싫어요…;;',
    description: '은근 여자들이 많이 보는 남자들의 "그 부위"',
    thumbnail: thumb5,
    video_url: 'https://www.youtube.com/watch?v=T1n2_nU9Y3M',
    category: '원장님 토크',
    is_featured: 1,
    is_ticker: 1
  },
  {
    id: 'portfolio-6',
    title: '최근 입술필러 받으러 온 사람들이 가장 원하는 입술 모양은? | #입술필러 #예쁜입술 #장원영',
    description: '환자들이 이것만 해달래요! 입술필러 트렌드!',
    thumbnail: thumb6,
    video_url: 'https://www.youtube.com/watch?v=kY9q8j7w1Zk',
    category: '트렌드/이슈',
    is_featured: 1,
    is_ticker: 1
  }
];

export const CAROUSEL_PORTFOLIOS: PortfolioItem[] = [
  {
    id: 'carousel-1',
    title: '연예인들도 선호하는 울써마지 대체품 🥰❤️',
    description: '채정안 pick! 요즘 연예인들은 울쎄라, 써마지 안해요',
    thumbnail: thumb1,
    video_url: 'https://www.youtube.com/watch?v=FjHGpYyW78Q',
    category: '리얼 후기',
    is_featured: 0,
    is_ticker: 1
  },
  {
    id: 'carousel-2',
    title: '10분 만에 10살 어려지기 #민트실리프팅 #팔자주름',
    description: '민트실 리프팅 전후 비교 분석',
    thumbnail: thumb_lifting,
    video_url: 'https://www.youtube.com/watch?v=M5GgB24z5Rk',
    category: '시술 정보',
    is_featured: 0,
    is_ticker: 1
  },
  {
    id: 'carousel-3',
    title: '여의사가 직접 받아보는 올리지오 600샷 솔직 후기',
    description: '올리지오 600샷 리얼 체험 및 통증 리뷰',
    thumbnail: thumb_oligio,
    video_url: 'https://www.youtube.com/watch?v=Qv-8_vD8n6s',
    category: '리얼 후기',
    is_featured: 1,
    is_ticker: 1
  },
  {
    id: 'carousel-4',
    title: '울트라콜 200 내돈내산 3개월 차 리얼 후기',
    description: '눈밑 꺼짐과 콜라겐 재생 효과 비교',
    thumbnail: thumb_ultracol,
    video_url: 'https://www.youtube.com/watch?v=b0S2HkWzY7c',
    category: '리얼 후기',
    is_featured: 0,
    is_ticker: 1
  },
  {
    id: 'carousel-5',
    title: '피부과전문의가 알려주는 피부 잡티 관리법',
    description: '잡티 레이저 시술 전 알아야 할 필수 지식',
    thumbnail: thumb4,
    video_url: 'https://www.youtube.com/watch?v=T1n2_nU9Y3M',
    category: '시술 정보',
    is_featured: 0,
    is_ticker: 1
  },
  {
    id: 'carousel-6',
    title: '연예인들이 많이 받는 피부과 시술 TOP 5',
    description: '촬영 전 연예인들이 몰래 받는 시술들',
    thumbnail: thumb_doctor_tips,
    video_url: 'https://www.youtube.com/watch?v=kY9q8j7w1Zk',
    category: '트렌드/이슈',
    is_featured: 0,
    is_ticker: 1
  }
];
