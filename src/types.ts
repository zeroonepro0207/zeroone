export interface SiteSettings {
  site_name: string;
  hero_title: string;
  hero_subtitle: string;
  primary_color: string;
  bg_color: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  youtube_url: string;
  instagram_url: string;
}

export interface Portfolio {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  video_url: string;
  category: string;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}
