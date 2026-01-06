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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          category: string | null
          created_at: string
          file_url: string | null
          id: string
          issue_date: string
          issuer: string
          name: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          issue_date: string
          issuer: string
          name: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          issue_date?: string
          issuer?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      cgpa_records: {
        Row: {
          created_at: string
          credits: number | null
          id: string
          semester: number
          sgpa: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits?: number | null
          id?: string
          semester: number
          sgpa: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits?: number | null
          id?: string
          semester?: number
          sgpa?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chapters: {
        Row: {
          chapter_number: number
          content: string | null
          created_at: string
          id: string
          name: string
          subject_id: string
          summary: string | null
        }
        Insert: {
          chapter_number: number
          content?: string | null
          created_at?: string
          id?: string
          name: string
          subject_id: string
          summary?: string | null
        }
        Update: {
          chapter_number?: number
          content?: string | null
          created_at?: string
          id?: string
          name?: string
          subject_id?: string
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_ai: boolean | null
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_ai?: boolean | null
          message: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_ai?: boolean | null
          message?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_premium: boolean | null
          link: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_premium?: boolean | null
          link?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_premium?: boolean | null
          link?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          college_branch: string | null
          college_course: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          school_class: number | null
          school_stream: Database["public"]["Enums"]["school_stream"] | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          college_branch?: string | null
          college_course?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          school_class?: number | null
          school_stream?: Database["public"]["Enums"]["school_stream"] | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          college_branch?: string | null
          college_course?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          school_class?: number | null
          school_stream?: Database["public"]["Enums"]["school_stream"] | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          chapter_id: string
          correct_answer: number
          created_at: string
          explanation: string | null
          id: string
          options: Json
          question: string
        }
        Insert: {
          chapter_id: string
          correct_answer: number
          created_at?: string
          explanation?: string | null
          id?: string
          options: Json
          question: string
        }
        Update: {
          chapter_id?: string
          correct_answer?: number
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_certificates: {
        Row: {
          certificate_number: string
          course_id: string
          course_name: string
          id: string
          issued_at: string
          score: number
          user_id: string
        }
        Insert: {
          certificate_number: string
          course_id: string
          course_name: string
          id?: string
          issued_at?: string
          score: number
          user_id: string
        }
        Update: {
          certificate_number?: string
          course_id?: string
          course_name?: string
          id?: string
          issued_at?: string
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      skill_video_notes: {
        Row: {
          course_id: string
          created_at: string
          id: string
          notes: string | null
          updated_at: string
          user_id: string
          video_index: number
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
          video_index: number
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
          video_index?: number
        }
        Relationships: []
      }
      skill_watched_videos: {
        Row: {
          course_id: string
          id: string
          user_id: string
          video_index: number
          watched_at: string
        }
        Insert: {
          course_id: string
          id?: string
          user_id: string
          video_index: number
          watched_at?: string
        }
        Update: {
          course_id?: string
          id?: string
          user_id?: string
          video_index?: number
          watched_at?: string
        }
        Relationships: []
      }
      skills_courses: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          is_premium: boolean | null
          name: string
          video_url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_premium?: boolean | null
          name: string
          video_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_premium?: boolean | null
          name?: string
          video_url?: string | null
        }
        Relationships: []
      }
      subjects: {
        Row: {
          class_level: number
          color: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
          stream: Database["public"]["Enums"]["school_stream"] | null
        }
        Insert: {
          class_level: number
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          stream?: Database["public"]["Enums"]["school_stream"] | null
        }
        Update: {
          class_level?: number
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          stream?: Database["public"]["Enums"]["school_stream"] | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          chapter_id: string
          completed: boolean | null
          created_at: string
          id: string
          quiz_completed_at: string | null
          quiz_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chapter_id: string
          completed?: boolean | null
          created_at?: string
          id?: string
          quiz_completed_at?: string | null
          quiz_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chapter_id?: string
          completed?: boolean | null
          created_at?: string
          id?: string
          quiz_completed_at?: string | null
          quiz_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills_progress: {
        Row: {
          completed: boolean | null
          course_id: string
          created_at: string
          eligible_for_internship: boolean | null
          id: string
          progress: number | null
          test_passed: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          course_id: string
          created_at?: string
          eligible_for_internship?: boolean | null
          id?: string
          progress?: number | null
          test_passed?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          course_id?: string
          created_at?: string
          eligible_for_internship?: boolean | null
          id?: string
          progress?: number | null
          test_passed?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "skills_courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      school_stream: "general" | "pcm" | "pcb"
      subscription_status: "freemium" | "premium"
      user_type: "school" | "college"
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
    Enums: {
      school_stream: ["general", "pcm", "pcb"],
      subscription_status: ["freemium", "premium"],
      user_type: ["school", "college"],
    },
  },
} as const
