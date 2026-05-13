export type UserRole = "seeker" | "guide" | "admin";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  language_preference: string | null;
  date_of_birth: string | null;
  age_verified: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type VerificationStatus =
  | "draft" | "submitted" | "under_review" | "verified" | "rejected";

export interface GuideProfile {
  id: string;
  user_id: string;
  full_name: string;
  city: string;
  phone: string | null;
  wilaya: string | null;
  bio: string | null;
  languages: string[];
  category: string;
  subcategory: string | null;
  description: string | null;
  price_per_day: number | null;
  price_per_hour: number | null;
  availability: string | null;
  photo_url: string | null;
  is_approved: boolean;
  verification_status: VerificationStatus;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  submitted_at: string | null;
  verified_at: string | null;
  rejected_at: string | null;
  years_experience: number | null;
  work_history: string | null;
  expertise: string | null;
  portfolio_links: string[] | null;
  working_hours: { start?: string; end?: string } | null;
  available_days: string[] | null;
  session_type: "online" | "in_person" | "both" | null;
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
