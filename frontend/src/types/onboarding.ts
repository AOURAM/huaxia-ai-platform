export interface OnboardingPayload {
  interests: string[];
  city?: string | null;
  university?: string | null;
  goal?: string | null;
  completed: boolean;
  skipped: boolean;
}

export interface OnboardingResponse {
  id: number;
  user_id: number;
  interests: string[];
  city: string | null;
  university: string | null;
  goal: string | null;
  completed: boolean;
  skipped: boolean;
  created_at: string;
  updated_at: string;
}