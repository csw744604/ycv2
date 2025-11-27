export interface SiteConfig {
  name: string;
  logoUrl: string; // URL or Base64
  footerText: string;
  loginBackgroundUrls: string[]; // Background images for admin login
  contact: {
    phone: string;
    address: string;
    email: string;
    wechat: string;
  };
}

export interface HeroSection {
  title: string;
  subtitle: string;
  imageUrls: string[]; // Changed from imageUrl to support carousel
  advantages: string[];
}

export interface Campus {
  id: string;
  name: string;
  address: string;
  description: string;
  imageUrl: string;
  facilities: string[];
}

export interface Achievement {
  id: string;
  studentName: string;
  title: string; // e.g., "Accepted to X University" or "Math Olympiad Gold"
  description: string;
  category: '升学' | '竞赛' | '提分';
  imageUrl: string;
}

export interface Teacher {
  id: string;
  name: string;
  title: string; // e.g., "Senior Math Teacher"
  bio: string;
  yearsOfExperience: number;
  tags: string[]; // e.g., ["Tsinghua Graduate", "Olympiad Coach"]
  imageUrl: string;
}

export interface AboutSection {
  history: string;
  philosophy: string;
  values: string;
  certImageUrls: string[];
}

// The entire JSON structure
export interface AppData {
  config: SiteConfig;
  home: HeroSection;
  campuses: Campus[];
  achievements: Achievement[];
  faculty: Teacher[];
  about: AboutSection;
}

// Admin Auth
export interface User {
  username: string;
  token: string;
}