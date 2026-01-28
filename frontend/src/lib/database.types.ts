// Supabase Database Types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// 태그 타입 (6종류)
export type TagType = 'monologue' | 'comfort' | 'shout' | 'emotion' | 'food' | 'music';

// 정렬 타입
export type SortType = 'reactions' | 'views' | 'latest';

// 댓글 정렬 타입
export type CommentSortType = 'latest' | 'popular';

// 신고 대상 타입
export type ReportTargetType = 'post' | 'comment';

// 신고 사유 타입
export type ReportReasonType = 'spam' | 'abuse' | 'harassment' | 'inappropriate' | 'copyright' | 'other';

// 리액션 타입 (6종류)
export type ReactionType = 'hand-heart' | 'heart' | 'moon' | 'smile' | 'beer' | 'coffee';

// 리액션 타입별 카운트
export type ReactionsByType = Partial<Record<ReactionType, number>>;

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          nickname: string;
          provider: 'kakao' | 'google';
          provider_id: string;
          profile_image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nickname: string;
          provider: 'kakao' | 'google';
          provider_id: string;
          profile_image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nickname?: string;
          provider?: 'kakao' | 'google';
          provider_id?: string;
          profile_image_url?: string | null;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          tag: TagType;
          image_url: string | null;
          is_permanent: boolean;
          view_count: number;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          tag: TagType;
          image_url?: string | null;
          is_permanent?: boolean;
          view_count?: number;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          tag?: TagType;
          image_url?: string | null;
          is_permanent?: boolean;
          view_count?: number;
          created_at?: string;
          expires_at?: string | null;
        };
      };
      reactions: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          reaction_type: ReactionType;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          reaction_type?: ReactionType;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          reaction_type?: ReactionType;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          parent_id: string | null;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          parent_id?: string | null;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          parent_id?: string | null;
          content?: string;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          target_type: ReportTargetType;
          target_id: string;
          reason: ReportReasonType;
          detail: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          target_type: ReportTargetType;
          target_id: string;
          reason: ReportReasonType;
          detail?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string;
          target_type?: ReportTargetType;
          target_id?: string;
          reason?: ReportReasonType;
          detail?: string | null;
          created_at?: string;
        };
      };
      comment_likes: {
        Row: {
          id: string;
          user_id: string;
          comment_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          comment_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          comment_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      posts_with_counts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          tag: TagType;
          image_url: string | null;
          is_permanent: boolean;
          view_count: number;
          created_at: string;
          expires_at: string | null;
          author_nickname: string;
          author_profile_image_url: string | null;
          reactions_count: number;
          comments_count: number;
          reactions_by_type: ReactionsByType | null;
        };
      };
      comments_with_counts: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          parent_id: string | null;
          content: string;
          created_at: string;
          author_nickname: string;
          author_profile_image_url: string | null;
          likes_count: number;
          replies_count: number;
        };
      };
    };
    Functions: {
      is_midnight_hours: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      generate_random_nickname: {
        Args: Record<string, never>;
        Returns: string;
      };
      increment_view_count: {
        Args: {
          p_post_id: string;
          p_user_id: string | null;
          p_ip_hash: string | null;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type User = Database['public']['Tables']['users']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'];
export type Reaction = Database['public']['Tables']['reactions']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type CommentLike = Database['public']['Tables']['comment_likes']['Row'];
export type Report = Database['public']['Tables']['reports']['Row'];

// View types
export type PostWithCountsRow = Database['public']['Views']['posts_with_counts']['Row'];
export type CommentWithCountsRow = Database['public']['Views']['comments_with_counts']['Row'];

// Extended types with relations
export interface PostWithDetails extends PostWithCountsRow {
  user: Pick<User, 'id' | 'nickname' | 'profile_image_url'>;
  is_reacted?: boolean;
  // 내가 누른 리액션 타입들
  my_reactions?: ReactionType[];
}

export interface CommentWithDetails extends CommentWithCountsRow {
  user: Pick<User, 'id' | 'nickname' | 'profile_image_url'>;
  is_liked?: boolean;
  replies?: CommentWithDetails[];
}
