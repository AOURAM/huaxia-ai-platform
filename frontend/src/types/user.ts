export type GenderValue = 'female' | 'male' | 'non_binary' | 'prefer_not_to_say';

export type AvatarStyle =
  | 'adventurer'
  | 'avataaars'
  | 'bottts'
  | 'lorelei'
  | 'thumbs'
  | 'personas'
  | 'initials';

export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string | null;
  gender?: GenderValue | null;
  avatar_style?: AvatarStyle | null;
  avatar_seed?: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

export interface UserUpdatePayload {
  username?: string;
  bio?: string | null;
  gender?: GenderValue | null;
  avatar_style?: AvatarStyle;
  avatar_seed?: string;
}