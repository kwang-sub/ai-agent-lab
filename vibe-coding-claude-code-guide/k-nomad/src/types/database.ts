export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type VoteType = "like" | "dislike";

export type Database = {
  public: {
    Tables: {
      cities: {
        Row: {
          id: string;
          name: string;
          slug: string;
          region: string;
          budget: string;
          environment: string;
          best_season: string;
          base_likes: number;
          base_dislikes: number;
          visual: string;
          mood: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          region: string;
          budget: string;
          environment: string;
          best_season: string;
          base_likes?: number;
          base_dislikes?: number;
          visual: string;
          mood: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cities"]["Insert"]>;
        Relationships: [];
      };
      city_votes: {
        Row: {
          id: string;
          city_id: string;
          user_id: string;
          vote_type: VoteType;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          city_id: string;
          user_id: string;
          vote_type: VoteType;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["city_votes"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "city_votes_city_id_fkey";
            columns: ["city_id"];
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_cities_with_votes: {
        Args: Record<string, never>;
        Returns: {
          id: string;
          name: string;
          slug: string;
          region: string;
          budget: string;
          environment: string;
          best_season: string;
          visual: string;
          mood: string;
          likes: number;
          dislikes: number;
          user_vote: VoteType | null;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
