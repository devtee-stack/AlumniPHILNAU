-- Make category_id optional in forum_threads table
-- This allows users to create threads without selecting a category

ALTER TABLE public.forum_threads 
ALTER COLUMN category_id DROP NOT NULL;
