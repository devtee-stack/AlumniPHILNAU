import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Thread = {
  id: string;
  title: string;
  body: string;
  excerpt?: string | null;
  category_id: string;
  user_id: string;
  reply_count: number | null;
  created_at: string;
  updated_at?: string;

  user_name?: string;
  avatar_url?: string | null;
  category_name?: string;
};

export interface ForumThread extends Thread {}

export const useForumThreads = (categoryId?: string) => {
  return useQuery({
    queryKey: ['forum-threads', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('forum_threads')
        .select(`
            *,
            profiles(
              full_name,
              avatar_url
            ),
            forum_categories(
              name
            )
          `)
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data: threads, error: threadsError } = await query;
      if (threadsError) throw threadsError;

      return (threads || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        body: t.body,
        excerpt: t.excerpt ?? null,
        category_id: t.category_id,
        user_id: t.user_id,
        reply_count: (t.reply_count ?? null) as number | null,
        created_at: t.created_at,
        updated_at: t.updated_at ?? undefined,

        user_name: t?.profiles?.full_name ?? undefined,
        avatar_url: t?.profiles?.avatar_url ?? null,
        category_name: t?.forum_categories?.name ?? undefined,
      })) as ForumThread[];
    },
  });
};

export const useForumCategories = () => {
  return useQuery({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });
};
