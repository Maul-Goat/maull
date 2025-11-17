export interface Skill {
  id: number;
  name: string;
  img_url: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  img_url: string;
  project_url?: string;
}

export interface TopEdit {
  id: number;
  title: string;
  description: string;
  img_url: string;
  tiktok_url?: string;
}

export interface Message {
  id: number;
  created_at: string;
  name: string;
  email: string;
  message: string;
}

export interface HeroContent {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
}

export interface VisitorLog {
  id: number;
  created_at: string;
  visitor_id: string;
  event_type: 'PAGE_VIEW' | 'FORM_SUBMIT';
  device_type: 'Desktop' | 'Mobile' | 'Unknown';
  user_agent: string;
  country?: string;
  ip_address?: string;
}
