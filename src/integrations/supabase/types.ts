export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          post_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: never
          post_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: never
          post_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      incoming_mail: {
        Row: {
          chrono_number: string
          created_at: string
          date: string
          document_link: string | null
          id: string
          mail_type: Database["public"]["Enums"]["mail_type"]
          medium: Database["public"]["Enums"]["mail_medium"]
          observations: string | null
          recipient_service: string
          response_date: string | null
          sender_address: string | null
          sender_name: string
          status: Database["public"]["Enums"]["mail_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          chrono_number: string
          created_at?: string
          date?: string
          document_link?: string | null
          id?: string
          mail_type: Database["public"]["Enums"]["mail_type"]
          medium: Database["public"]["Enums"]["mail_medium"]
          observations?: string | null
          recipient_service: string
          response_date?: string | null
          sender_address?: string | null
          sender_name: string
          status?: Database["public"]["Enums"]["mail_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          chrono_number?: string
          created_at?: string
          date?: string
          document_link?: string | null
          id?: string
          mail_type?: Database["public"]["Enums"]["mail_type"]
          medium?: Database["public"]["Enums"]["mail_medium"]
          observations?: string | null
          recipient_service?: string
          response_date?: string | null
          sender_address?: string | null
          sender_name?: string
          status?: Database["public"]["Enums"]["mail_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          id: number
          post_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          post_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          post_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      mail_statistics: {
        Row: {
          administrative_count: number
          commercial_count: number
          created_at: string
          financial_count: number
          id: string
          incoming_count: number
          month: string
          other_count: number
          outgoing_count: number
          technical_count: number
          updated_at: string
          year: number
        }
        Insert: {
          administrative_count?: number
          commercial_count?: number
          created_at?: string
          financial_count?: number
          id?: string
          incoming_count?: number
          month: string
          other_count?: number
          outgoing_count?: number
          technical_count?: number
          updated_at?: string
          year: number
        }
        Update: {
          administrative_count?: number
          commercial_count?: number
          created_at?: string
          financial_count?: number
          id?: string
          incoming_count?: number
          month?: string
          other_count?: number
          outgoing_count?: number
          technical_count?: number
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      outgoing_mail: {
        Row: {
          address: string | null
          chrono_number: string
          correspondent: string
          created_at: string
          date: string
          document_link: string | null
          id: string
          medium: Database["public"]["Enums"]["mail_medium"]
          observations: string | null
          service: string
          status: Database["public"]["Enums"]["mail_status"]
          subject: string
          updated_at: string
          writer: string
        }
        Insert: {
          address?: string | null
          chrono_number: string
          correspondent: string
          created_at?: string
          date?: string
          document_link?: string | null
          id?: string
          medium: Database["public"]["Enums"]["mail_medium"]
          observations?: string | null
          service: string
          status?: Database["public"]["Enums"]["mail_status"]
          subject: string
          updated_at?: string
          writer: string
        }
        Update: {
          address?: string | null
          chrono_number?: string
          correspondent?: string
          created_at?: string
          date?: string
          document_link?: string | null
          id?: string
          medium?: Database["public"]["Enums"]["mail_medium"]
          observations?: string | null
          service?: string
          status?: Database["public"]["Enums"]["mail_status"]
          subject?: string
          updated_at?: string
          writer?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: never
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: never
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          id: number
          updated_at: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: never
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: never
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      overdue_mail_view: {
        Row: {
          chrono_number: string | null
          created_at: string | null
          date: string | null
          document_link: string | null
          id: string | null
          mail_type: Database["public"]["Enums"]["mail_type"] | null
          medium: Database["public"]["Enums"]["mail_medium"] | null
          observations: string | null
          recipient_service: string | null
          response_date: string | null
          sender_address: string | null
          sender_name: string | null
          status: Database["public"]["Enums"]["mail_status"] | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          chrono_number?: string | null
          created_at?: string | null
          date?: string | null
          document_link?: string | null
          id?: string | null
          mail_type?: Database["public"]["Enums"]["mail_type"] | null
          medium?: Database["public"]["Enums"]["mail_medium"] | null
          observations?: string | null
          recipient_service?: string | null
          response_date?: string | null
          sender_address?: string | null
          sender_name?: string | null
          status?: Database["public"]["Enums"]["mail_status"] | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          chrono_number?: string | null
          created_at?: string | null
          date?: string | null
          document_link?: string | null
          id?: string | null
          mail_type?: Database["public"]["Enums"]["mail_type"] | null
          medium?: Database["public"]["Enums"]["mail_medium"] | null
          observations?: string | null
          recipient_service?: string | null
          response_date?: string | null
          sender_address?: string | null
          sender_name?: string | null
          status?: Database["public"]["Enums"]["mail_status"] | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      mail_medium: "Email" | "Physical" | "Fax" | "Other"
      mail_status: "Pending" | "Processing" | "Completed" | "Overdue"
      mail_type:
        | "Administrative"
        | "Technical"
        | "Commercial"
        | "Financial"
        | "Other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      mail_medium: ["Email", "Physical", "Fax", "Other"],
      mail_status: ["Pending", "Processing", "Completed", "Overdue"],
      mail_type: [
        "Administrative",
        "Technical",
        "Commercial",
        "Financial",
        "Other",
      ],
    },
  },
} as const
