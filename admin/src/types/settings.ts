export interface WebsiteSettings {
  id: string;
  siteTitle: string | null;
  siteDescription: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroImage: string | null;
  about: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  github: string | null;
  linkedin: string | null;
  facebook: string | null;
  instagram: string | null;
  resumeUrl: string | null;
  themeColor: string | null;
  logo: string | null;
  favicon: string | null;
  updatedAt: string;
}

export interface UpdateSettingsInput {
  siteTitle?: string;
  siteDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  about?: string;
  email?: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  resumeUrl?: string;
  themeColor?: string;
  logo?: string;
  favicon?: string;
}
