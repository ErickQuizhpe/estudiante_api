export interface Company {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  mission: string;
  vision: string;
  socialMedia: SocialMedia[];
  banners: Banner[];
}

export interface SocialMedia {
  id: number;
  platform: string;
  url: string;
  iconUrl: string;
  active: boolean;
}

export interface Banner {
  id: number;
  imageUrl: string;
  description: string;
  active: boolean;
}
