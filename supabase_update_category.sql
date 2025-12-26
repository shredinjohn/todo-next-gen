-- Run this in your Supabase SQL Editor to add the category column
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Blogs';
