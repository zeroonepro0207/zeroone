export interface SiteSettings {
  site_name: string;
  hero_title: string;
  hero_subtitle: string;
  hero_video_url?: string;
  primary_color: string;
  bg_color: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  youtube_url: string;
  instagram_url: string;
  categories: string; // Comma separated list
}

export interface Portfolio {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  video_url: string;
  category: string;
  is_featured: number;
  is_ticker?: number; // 1 = show in flowing marquee ticker, 0 = do not show
  created_at: any;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: any;
}
