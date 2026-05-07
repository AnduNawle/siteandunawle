export enum EngagementType {
  SYMPATHISANT = "sympathisant",
  MEMBRE = "membre",
  BENEVOLE = "benevole",
  RESPONSABLE_LOCAL = "responsable_local",
}

export enum ArticleStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

export enum EventStatus {
  UPCOMING = "upcoming",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  roles: string[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  image?: string;
  summary?: string;
  content: string;
  status: ArticleStatus;
  publishedAt?: any;
  createdAt: any;
  categoryId?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  image?: string;
  description: string;
  location: string;
  eventDate: string;
  startTime: string;
  status: EventStatus;
}

export interface Program {
  id: string;
  title: string;
  icon?: string;
  shortDescription: string;
  content: string;
  position: number;
  isActive: boolean;
}

export interface TeamMember {
  id: string;
  firstname: string;
  lastname: string;
  role: string;
  photo?: string;
  bio?: string;
  order: number;
}

export interface JoinRequest {
  id: string;
  firstname: string;
  lastname: string;
  phone?: string;
  email: string;
  locality?: string;
  profession?: string;
  engagementType: EngagementType;
  message?: string;
  createdAt: any;
  status: 'pending' | 'processed';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: any;
}

export interface SiteSettings {
  partyName: string;
  slogan: string;
  logo?: string;
  email: string;
  phone: string;
  address: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  heroImage?: string;
  heroText?: string;
}
