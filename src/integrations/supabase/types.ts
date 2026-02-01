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
      achievement_definitions: {
        Row: {
          achievement_id: string
          category: string
          created_at: string | null
          description: string
          icon_name: string
          id: string
          level: number | null
          points: number | null
          requirements: Json | null
          threshold: number | null
          title: string
          unit: string | null
        }
        Insert: {
          achievement_id: string
          category: string
          created_at?: string | null
          description: string
          icon_name: string
          id?: string
          level?: number | null
          points?: number | null
          requirements?: Json | null
          threshold?: number | null
          title: string
          unit?: string | null
        }
        Update: {
          achievement_id?: string
          category?: string
          created_at?: string | null
          description?: string
          icon_name?: string
          id?: string
          level?: number | null
          points?: number | null
          requirements?: Json | null
          threshold?: number | null
          title?: string
          unit?: string | null
        }
        Relationships: []
      }
      achievements: {
        Row: {
          achievement_id: string
          description: string | null
          earned_at: string | null
          id: string
          title: string
          user_id: string | null
        }
        Insert: {
          achievement_id: string
          description?: string | null
          earned_at?: string | null
          id?: string
          title: string
          user_id?: string | null
        }
        Update: {
          achievement_id?: string
          description?: string | null
          earned_at?: string | null
          id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      carbon_entries: {
        Row: {
          activity_type: string
          amount: number
          category: string
          created_at: string | null
          date: string
          emissions: number
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          amount: number
          category: string
          created_at?: string | null
          date: string
          emissions: number
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          emissions?: number
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_summaries: {
        Row: {
          created_at: string | null
          date: string
          diet: number | null
          energy: number | null
          id: string
          total: number | null
          transportation: number | null
          updated_at: string | null
          user_id: string
          waste: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          diet?: number | null
          energy?: number | null
          id?: string
          total?: number | null
          transportation?: number | null
          updated_at?: string | null
          user_id: string
          waste?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          diet?: number | null
          energy?: number | null
          id?: string
          total?: number | null
          transportation?: number | null
          updated_at?: string | null
          user_id?: string
          waste?: number | null
        }
        Relationships: []
      }
      eco_tips: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          impact_level: number
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          impact_level: number
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          impact_level?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          consecutive_days: number | null
          data_sharing_enabled: boolean | null
          eco_points: number | null
          email: string | null
          energy_savings: number | null
          id: string
          joined_date: string | null
          language: string | null
          level: number | null
          measurement_unit: string | null
          name: string | null
          notifications_enabled: boolean | null
          transportation_reductions: number | null
          updated_at: string | null
          waste_reduction: number | null
        }
        Insert: {
          avatar_url?: string | null
          consecutive_days?: number | null
          data_sharing_enabled?: boolean | null
          eco_points?: number | null
          email?: string | null
          energy_savings?: number | null
          id: string
          joined_date?: string | null
          language?: string | null
          level?: number | null
          measurement_unit?: string | null
          name?: string | null
          notifications_enabled?: boolean | null
          transportation_reductions?: number | null
          updated_at?: string | null
          waste_reduction?: number | null
        }
        Update: {
          avatar_url?: string | null
          consecutive_days?: number | null
          data_sharing_enabled?: boolean | null
          eco_points?: number | null
          email?: string | null
          energy_savings?: number | null
          id?: string
          joined_date?: string | null
          language?: string | null
          level?: number | null
          measurement_unit?: string | null
          name?: string | null
          notifications_enabled?: boolean | null
          transportation_reductions?: number | null
          updated_at?: string | null
          waste_reduction?: number | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievement_definitions"
            referencedColumns: ["achievement_id"]
          },
        ]
      }
      user_baselines: {
        Row: {
          created_at: string | null
          diet_emissions: number
          energy_emissions: number
          id: string
          transportation_emissions: number
          user_id: string
          waste_emissions: number
        }
        Insert: {
          created_at?: string | null
          diet_emissions?: number
          energy_emissions?: number
          id?: string
          transportation_emissions?: number
          user_id: string
          waste_emissions?: number
        }
        Update: {
          created_at?: string | null
          diet_emissions?: number
          energy_emissions?: number
          id?: string
          transportation_emissions?: number
          user_id?: string
          waste_emissions?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_progress: {
        Args: { user_uuid: string }
        Returns: {
          category: string
          current_emissions: number
          baseline_emissions: number
          reduction: number
          percentage: number
        }[]
      }
      refresh_daily_summaries: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
