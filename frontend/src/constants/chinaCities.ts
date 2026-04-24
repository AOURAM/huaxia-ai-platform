export interface ChinaCity {
  slug: string;
  name: string;
  province: string;
  region: 'north' | 'south' | 'coastal' | 'west' | 'central';
  lat: number;
  lng: number;
  tags: string[];
  imageUrl: string;
  description: string;
}

export const CHINA_CITIES: ChinaCity[] = [
  {
    slug: 'shanghai',
    name: 'Shanghai',
    province: 'Shanghai',
    region: 'coastal',
    lat: 31.2304,
    lng: 121.4737,
    tags: ['Financial Hub', 'Coastal'],
    imageUrl: 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?q=80&w=1200&auto=format&fit=crop',
    description:
      'Shanghai, situated on the central coast of China, is the country’s biggest city and a global financial hub. Its heart is the Bund, a famed waterfront promenade lined with colonial-era buildings. Across the Huangpu River rises Pudong’s futuristic skyline.',
  },
  {
    slug: 'beijing',
    name: 'Beijing',
    province: 'Beijing',
    region: 'north',
    lat: 39.9042,
    lng: 116.4074,
    tags: ['Capital', 'Universities'],
    imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1200&auto=format&fit=crop',
    description:
      'Beijing is China’s capital and one of the most important academic and cultural centers in the country. It is home to major universities, museums, historic districts, internships, and strong public transportation connections.',
  },
  {
    slug: 'wuhan',
    name: 'Wuhan',
    province: 'Hubei',
    region: 'central',
    lat: 30.5928,
    lng: 114.3055,
    tags: ['Student City', 'Central China'],
    imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1200&auto=format&fit=crop',
    description:
      'Wuhan is a major education hub in central China with many universities and a large student population. It offers lower living costs than coastal megacities while still providing strong transport links and active city life.',
  },
  {
    slug: 'chengdu',
    name: 'Chengdu',
    province: 'Sichuan',
    region: 'west',
    lat: 30.5728,
    lng: 104.0668,
    tags: ['Food Culture', 'West China'],
    imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1200&auto=format&fit=crop',
    description:
      'Chengdu is known for its relaxed lifestyle, food culture, and growing international student community. It is a strong choice for students interested in western China, culture, and affordable urban living.',
  },
  {
    slug: 'xian',
    name: "Xi'an",
    province: 'Shaanxi',
    region: 'west',
    lat: 34.3416,
    lng: 108.9398,
    tags: ['History', 'Culture'],
    imageUrl: 'https://images.unsplash.com/photo-1596097155664-4a90ebac9f2c?q=80&w=1200&auto=format&fit=crop',
    description:
      "Xi'an is one of China’s historic capitals and a strong cultural destination for students. It combines universities, ancient landmarks, and a lower-cost student lifestyle compared with the largest coastal cities.",
  },
];