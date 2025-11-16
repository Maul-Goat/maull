
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
}

export interface Message {
  id: number;
  created_at: string;
  name: string;
  email: string;
  message: string;
}
