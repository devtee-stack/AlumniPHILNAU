import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ForumThread {
  id: string;
  title: string;
  body: string;
  user_id: string;
  category_id: string;
  reply_count: number;
  created_at: string;
  user_name?: string;
  category_name?: string;
}

export const useForumThreads = (categoryId?: string) => {
  return useQuery({
    queryKey: ['forum-threads', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('forum_threads')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data: threads, error: threadsError } = await query;
      if (threadsError) throw threadsError;

      // Fetch related data separately
      const threadsWithDetails = await Promise.all(
        (threads || []).map(async (thread) => {
          const [profileResult, categoryResult] = await Promise.all([
            supabase.from('profiles').select('full_name').eq('id', thread.user_id).single(),
            supabase.from('forum_categories').select('name').eq('id', thread.category_id).single(),
          ]);

          return {
            ...thread,
            user_name: profileResult.data?.full_name || 'Unknown',
            category_name: categoryResult.data?.name || 'General',
          };
        })
      );

      return threadsWithDetails as ForumThread[];
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
