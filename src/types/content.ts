export type SectionId = 'header' | 'hero' | 'projects' | 'skills' | 'experiences' | 'services' | 'testimonials' | 'contact' | 'footer';
export type MediaType = 'image' | 'gif' | 'video';
export interface MediaItem { type: MediaType; url: string; alt?: string }
export interface ActionLink { label: string; url: string }
export interface NavigationItem { id: string; label: string; url: string }
export interface Project { id: string; title: string; description: string; tags: string[]; thumbnail?: string; media: MediaItem[]; projectUrl?: string; sourceUrl?: string; metadata?: string }
export interface Skill { id: string; name: string; description?: string; image?: string; proficiency?: number; category?: string }
export interface Experience { id: string; title: string; company: string; employmentType?: string; startDate?: string; endDate?: string; current: boolean; description: string; achievements: string[]; logo?: string; companyUrl?: string }
export interface Service { id: string; title: string; description: string; image?: string; features: string[] }
export interface Testimonial { id: string; clientName: string; clientRole?: string; company?: string; text: string; clientImage?: string; companyLogo?: string }
export interface SocialLink { id: string; platform: string; label: string; url: string; image?: string }
export interface ContentSection { id: SectionId; enabled: boolean }
export interface PortfolioContent {
  version: number;
  header: { logoText: string; logoImage?: string; navigation: NavigationItem[]; action?: ActionLink };
  hero: { name: string; title: string; heading: string; description: string; profileImage?: string; primaryAction?: ActionLink; secondaryAction?: ActionLink; extraText?: string };
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  services: Service[];
  testimonials: Testimonial[];
  socials: SocialLink[];
  contacts: { email?: string; phone?: string; location?: string; action?: ActionLink; additionalInfo?: string };
  footer: { text?: string; copyright?: string; navigation: NavigationItem[]; socials: SocialLink[]; contactText?: string };
  sections: ContentSection[];
}
