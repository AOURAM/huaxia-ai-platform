export interface City {
  id: number;
  slug: string;
  name: string;
  province: string;
  region: 'north' | 'south' | 'coastal' | 'west' | 'central';
  lat: number;
  lng: number;
  description: string;
  image_url: string | null;
  tags: string[];
  student_summary: string | null;
  cost_level: 'low' | 'medium' | 'high' | null;
  popular_universities: string[];
  highlights: string[];
  created_at: string;
  updated_at: string;
}