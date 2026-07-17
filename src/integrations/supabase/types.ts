export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string
          date: string
          guide_id: string
          id: string
          notes: string | null
          seeker_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          guide_id: string
          id?: string
          notes?: string | null
          seeker_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          guide_id?: string
          id?: string
          notes?: string | null
          seeker_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guide_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_seeker_id_fkey"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_consents: {
        Row: {
          accepted_accurate_info: boolean
          accepted_privacy: boolean
          accepted_terms: boolean
          app_version: string | null
          city: string
          consent_ip: string | null
          consented_at: string
          country_of_residence: string
          created_at: string
          date_of_birth: string
          full_legal_name: string
          guide_id: string
          id: string
          kyc_consent: boolean
          nationality: string
          phone: string
          preferred_language: string
          privacy_version: string
          terms_version: string
          understood_approval: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted_accurate_info?: boolean
          accepted_privacy?: boolean
          accepted_terms?: boolean
          app_version?: string | null
          city: string
          consent_ip?: string | null
          consented_at?: string
          country_of_residence: string
          created_at?: string
          date_of_birth: string
          full_legal_name: string
          guide_id: string
          id?: string
          kyc_consent?: boolean
          nationality: string
          phone: string
          preferred_language: string
          privacy_version: string
          terms_version: string
          understood_approval?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          accepted_accurate_info?: boolean
          accepted_privacy?: boolean
          accepted_terms?: boolean
          app_version?: string | null
          city?: string
          consent_ip?: string | null
          consented_at?: string
          country_of_residence?: string
          created_at?: string
          date_of_birth?: string
          full_legal_name?: string
          guide_id?: string
          id?: string
          kyc_consent?: boolean
          nationality?: string
          phone?: string
          preferred_language?: string
          privacy_version?: string
          terms_version?: string
          understood_approval?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_consents_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: true
            referencedRelation: "guide_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_documents: {
        Row: {
          doc_type: string
          file_name: string
          file_path: string
          guide_id: string
          id: string
          uploaded_at: string
        }
        Insert: {
          doc_type: string
          file_name: string
          file_path: string
          guide_id: string
          id?: string
          uploaded_at?: string
        }
        Update: {
          doc_type?: string
          file_name?: string
          file_path?: string
          guide_id?: string
          id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_documents_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guide_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_languages: {
        Row: {
          created_at: string
          guide_id: string
          id: string
          language: string
          proficiency: string
        }
        Insert: {
          created_at?: string
          guide_id: string
          id?: string
          language: string
          proficiency: string
        }
        Update: {
          created_at?: string
          guide_id?: string
          id?: string
          language?: string
          proficiency?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_languages_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guide_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          availability: string | null
          available_days: string[] | null
          bio: string | null
          category: string
          city: string
          created_at: string
          description: string | null
          expertise: string | null
          full_name: string
          id: string
          is_approved: boolean
          languages: string[]
          phone: string | null
          photo_url: string | null
          portfolio_links: string[] | null
          price_per_day: number | null
          price_per_hour: number | null
          rejected_at: string | null
          rejection_reason: string | null
          session_type: string | null
          subcategory: string | null
          submitted_at: string | null
          updated_at: string
          user_id: string
          verification_status: string
          verified_at: string | null
          wilaya: string | null
          work_history: string | null
          working_hours: Json | null
          years_experience: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          availability?: string | null
          available_days?: string[] | null
          bio?: string | null
          category: string
          city: string
          created_at?: string
          description?: string | null
          expertise?: string | null
          full_name: string
          id?: string
          is_approved?: boolean
          languages: string[]
          phone?: string | null
          photo_url?: string | null
          portfolio_links?: string[] | null
          price_per_day?: number | null
          price_per_hour?: number | null
          rejected_at?: string | null
          rejection_reason?: string | null
          session_type?: string | null
          subcategory?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id: string
          verification_status?: string
          verified_at?: string | null
          wilaya?: string | null
          work_history?: string | null
          working_hours?: Json | null
          years_experience?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          availability?: string | null
          available_days?: string[] | null
          bio?: string | null
          category?: string
          city?: string
          created_at?: string
          description?: string | null
          expertise?: string | null
          full_name?: string
          id?: string
          is_approved?: boolean
          languages?: string[]
          phone?: string | null
          photo_url?: string | null
          portfolio_links?: string[] | null
          price_per_day?: number | null
          price_per_hour?: number | null
          rejected_at?: string | null
          rejection_reason?: string | null
          session_type?: string | null
          subcategory?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: string
          verified_at?: string | null
          wilaya?: string | null
          work_history?: string | null
          working_hours?: Json | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "guide_profiles_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          booking_id: string | null
          content: string
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          booking_id?: string | null
          content: string
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          booking_id?: string | null
          content?: string
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age_verified: boolean
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          id: string
          language_preference: string | null
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          age_verified?: boolean
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          id: string
          language_preference?: string | null
          name: string
          role?: string
          updated_at?: string
        }
        Update: {
          age_verified?: boolean
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          id?: string
          language_preference?: string | null
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
