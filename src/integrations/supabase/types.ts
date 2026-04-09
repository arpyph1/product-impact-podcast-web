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
      article_entities: {
        Row: {
          article_id: string
          entity_id: string
          relevance: string | null
        }
        Insert: {
          article_id: string
          entity_id: string
          relevance?: string | null
        }
        Update: {
          article_id?: string
          entity_id?: string
          relevance?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_entities_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_entities_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      article_faqs: {
        Row: {
          answer: string
          article_id: string
          id: string
          position: number | null
          question: string
        }
        Insert: {
          answer: string
          article_id: string
          id?: string
          position?: number | null
          question: string
        }
        Update: {
          answer?: string
          article_id?: string
          id?: string
          position?: number | null
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_faqs_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_slugs: string[]
          byline_role: string | null
          canonical_url: string
          cms_locked_hero: boolean | null
          cms_locked_meta: boolean | null
          cms_locked_schema: boolean | null
          cms_locked_themes: boolean | null
          content_html: string
          content_markdown: string
          created_at: string | null
          dateline: string | null
          format: string
          hero_image_alt: string | null
          hero_image_credit: string | null
          hero_image_url: string | null
          id: string
          last_updated: string | null
          lenses: string[]
          meta_description: string
          primary_podcast_episode_guid: string | null
          publish_date: string
          published: boolean | null
          read_time_minutes: number | null
          schema_jsonld: Json | null
          slug: string
          subtitle: string | null
          themes: string[]
          title: string
          topics: string[] | null
          updated_at: string | null
          word_count: number | null
        }
        Insert: {
          author_slugs?: string[]
          byline_role?: string | null
          canonical_url?: string
          cms_locked_hero?: boolean | null
          cms_locked_meta?: boolean | null
          cms_locked_schema?: boolean | null
          cms_locked_themes?: boolean | null
          content_html?: string
          content_markdown?: string
          created_at?: string | null
          dateline?: string | null
          format?: string
          hero_image_alt?: string | null
          hero_image_credit?: string | null
          hero_image_url?: string | null
          id?: string
          last_updated?: string | null
          lenses?: string[]
          meta_description?: string
          primary_podcast_episode_guid?: string | null
          publish_date: string
          published?: boolean | null
          read_time_minutes?: number | null
          schema_jsonld?: Json | null
          slug: string
          subtitle?: string | null
          themes?: string[]
          title: string
          topics?: string[] | null
          updated_at?: string | null
          word_count?: number | null
        }
        Update: {
          author_slugs?: string[]
          byline_role?: string | null
          canonical_url?: string
          cms_locked_hero?: boolean | null
          cms_locked_meta?: boolean | null
          cms_locked_schema?: boolean | null
          cms_locked_themes?: boolean | null
          content_html?: string
          content_markdown?: string
          created_at?: string | null
          dateline?: string | null
          format?: string
          hero_image_alt?: string | null
          hero_image_credit?: string | null
          hero_image_url?: string | null
          id?: string
          last_updated?: string | null
          lenses?: string[]
          meta_description?: string
          primary_podcast_episode_guid?: string | null
          publish_date?: string
          published?: boolean | null
          read_time_minutes?: number | null
          schema_jsonld?: Json | null
          slug?: string
          subtitle?: string | null
          themes?: string[]
          title?: string
          topics?: string[] | null
          updated_at?: string | null
          word_count?: number | null
        }
        Relationships: []
      }
      cms_content: {
        Row: {
          data: Json
          id: string
          updated_at: string
        }
        Insert: {
          data?: Json
          id?: string
          updated_at?: string
        }
        Update: {
          data?: Json
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      entities: {
        Row: {
          aliases: string[] | null
          canonical_url: string
          created_at: string | null
          description: string | null
          external_links: Json | null
          id: string
          lenses: string[] | null
          long_form: string | null
          metadata: Json | null
          name: string
          schema_jsonld: Json | null
          slug: string
          themes: string[] | null
          type: Database["public"]["Enums"]["entity_type"]
          updated_at: string | null
        }
        Insert: {
          aliases?: string[] | null
          canonical_url?: string
          created_at?: string | null
          description?: string | null
          external_links?: Json | null
          id?: string
          lenses?: string[] | null
          long_form?: string | null
          metadata?: Json | null
          name: string
          schema_jsonld?: Json | null
          slug: string
          themes?: string[] | null
          type: Database["public"]["Enums"]["entity_type"]
          updated_at?: string | null
        }
        Update: {
          aliases?: string[] | null
          canonical_url?: string
          created_at?: string | null
          description?: string | null
          external_links?: Json | null
          id?: string
          lenses?: string[] | null
          long_form?: string | null
          metadata?: Json | null
          name?: string
          schema_jsonld?: Json | null
          slug?: string
          themes?: string[] | null
          type?: Database["public"]["Enums"]["entity_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      episode_entities: {
        Row: {
          context: string | null
          entity_id: string
          episode_guid: string
          is_first_appearance: boolean | null
          relevance: string | null
          speaker: string | null
          timestamp_text: string | null
        }
        Insert: {
          context?: string | null
          entity_id: string
          episode_guid: string
          is_first_appearance?: boolean | null
          relevance?: string | null
          speaker?: string | null
          timestamp_text?: string | null
        }
        Update: {
          context?: string | null
          entity_id?: string
          episode_guid?: string
          is_first_appearance?: boolean | null
          relevance?: string | null
          speaker?: string | null
          timestamp_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "episode_entities_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      episode_faqs: {
        Row: {
          answer: string
          episode_guid: string
          id: string
          position: number | null
          question: string
        }
        Insert: {
          answer: string
          episode_guid: string
          id?: string
          position?: number | null
          question: string
        }
        Update: {
          answer?: string
          episode_guid?: string
          id?: string
          position?: number | null
          question?: string
        }
        Relationships: []
      }
      episode_shownotes: {
        Row: {
          content_html: string
          created_at: string
          duration: string | null
          episode_guid: string
          episode_number: number | null
          guests: Json | null
          hosts: string[] | null
          id: string
          lenses: string[] | null
          links: Json
          meta_description: string | null
          published: boolean
          published_at: string | null
          schema_jsonld: Json | null
          season_number: number | null
          slug: string | null
          themes: string[] | null
          title: string
          transcript_markdown: string | null
          updated_at: string
          video_urls: Json
        }
        Insert: {
          content_html?: string
          created_at?: string
          duration?: string | null
          episode_guid: string
          episode_number?: number | null
          guests?: Json | null
          hosts?: string[] | null
          id?: string
          lenses?: string[] | null
          links?: Json
          meta_description?: string | null
          published?: boolean
          published_at?: string | null
          schema_jsonld?: Json | null
          season_number?: number | null
          slug?: string | null
          themes?: string[] | null
          title?: string
          transcript_markdown?: string | null
          updated_at?: string
          video_urls?: Json
        }
        Update: {
          content_html?: string
          created_at?: string
          duration?: string | null
          episode_guid?: string
          episode_number?: number | null
          guests?: Json | null
          hosts?: string[] | null
          id?: string
          lenses?: string[] | null
          links?: Json
          meta_description?: string | null
          published?: boolean
          published_at?: string | null
          schema_jsonld?: Json | null
          season_number?: number | null
          slug?: string | null
          themes?: string[] | null
          title?: string
          transcript_markdown?: string | null
          updated_at?: string
          video_urls?: Json
        }
        Relationships: []
      }
      episode_tags: {
        Row: {
          classified_at: string
          description_norm: string
          episode_guid: string
          feed_url: string
          focus: string[]
          focus_scores: Json
          full_norm: string
          id: string
          theme_scores: Json
          themes: string[]
          title: string
          title_norm: string
        }
        Insert: {
          classified_at?: string
          description_norm?: string
          episode_guid: string
          feed_url?: string
          focus?: string[]
          focus_scores?: Json
          full_norm?: string
          id?: string
          theme_scores?: Json
          themes?: string[]
          title?: string
          title_norm?: string
        }
        Update: {
          classified_at?: string
          description_norm?: string
          episode_guid?: string
          feed_url?: string
          focus?: string[]
          focus_scores?: Json
          full_norm?: string
          id?: string
          theme_scores?: Json
          themes?: string[]
          title?: string
          title_norm?: string
        }
        Relationships: []
      }
      lenses: {
        Row: {
          audience: string | null
          description: string
          id: string
          meta_description: string | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          audience?: string | null
          description?: string
          id?: string
          meta_description?: string | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          audience?: string | null
          description?: string
          id?: string
          meta_description?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          active: boolean | null
          created_at: string | null
          cta_text: string | null
          description: string | null
          display_order: number | null
          id: string
          logo_url: string | null
          name: string
          slug: string
          tagline: string | null
          themes: string[] | null
          tier: string | null
          website_url: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          cta_text?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          tagline?: string | null
          themes?: string[] | null
          tier?: string | null
          website_url?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          cta_text?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          tagline?: string | null
          themes?: string[] | null
          tier?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      tagging_rules: {
        Row: {
          config: Json
          id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          config?: Json
          id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          config?: Json
          id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      themes: {
        Row: {
          description: string
          hero_image_url: string | null
          icon: string | null
          id: string
          long_form_intro: string | null
          meta_description: string | null
          name: string
          schema_jsonld: Json | null
          slug: string
          target_search_queries: string[] | null
          theme_color: string | null
          updated_at: string | null
        }
        Insert: {
          description?: string
          hero_image_url?: string | null
          icon?: string | null
          id?: string
          long_form_intro?: string | null
          meta_description?: string | null
          name: string
          schema_jsonld?: Json | null
          slug: string
          target_search_queries?: string[] | null
          theme_color?: string | null
          updated_at?: string | null
        }
        Update: {
          description?: string
          hero_image_url?: string | null
          icon?: string | null
          id?: string
          long_form_intro?: string | null
          meta_description?: string | null
          name?: string
          schema_jsonld?: Json | null
          slug?: string
          target_search_queries?: string[] | null
          theme_color?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
      entity_type:
        | "concept"
        | "person"
        | "organization"
        | "framework"
        | "source"
        | "product"
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
      app_role: ["admin", "editor"],
      entity_type: [
        "concept",
        "person",
        "organization",
        "framework",
        "source",
        "product",
      ],
    },
  },
} as const
