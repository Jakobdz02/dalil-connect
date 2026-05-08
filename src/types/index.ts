export type UserRole = "seeker" | "guide" | "admin";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  language_preference: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GuideProfile {
  id: string;
  user_id: string;
  full_name: string;
  city: string;
  languages: string[];
  category: string;
  description: string | null;
  price_per_day: number | null;
  availability: string | null;
  photo_url: string | null;
  is_approved: boolean;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  seeker_id: string;
  guide_id: string;
  date: string;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  booking_id: string | null;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}
