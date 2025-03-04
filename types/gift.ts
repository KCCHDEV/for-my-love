export interface GiftData {
  type: string;
  message: string;
  from?: string;
  to?: string;
  customizations: {
    // Love Letter
    letterStyle?: 'romantic' | 'cute' | 'formal';
    bgColor?: string;
    
    // Photo Album
    photos?: string[];
    albumTheme?: 'hearts' | 'flowers' | 'minimal';
    
    // Playlist
    songs?: Array<{
      title: string;
      artist: string;
      url?: string;
    }>;
    
    // Treasure Hunt
    clues?: Array<{
      hint: string;
      answer: string;
    }>;
    
    // Love Coupons
    coupons?: Array<{
      title: string;
      description: string;
      expiryDate?: string;
    }>;
  };
}

export interface Gift extends GiftData {
  id: string;
  created: Date;
  views: number;
  opened: boolean;
  lastViewed?: Date;
}
