export interface CultureEvent {
  id: number;
  title: string;
  description: string;
  location: string;
  event_date: string;
  start_time: string;
  tag: string;
  created_by_user_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCultureEventPayload {
  title: string;
  description: string;
  location: string;
  event_date: string;
  start_time: string;
  tag: string;
}