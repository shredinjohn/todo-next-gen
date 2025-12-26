-- Run this in your Supabase SQL Editor to add the project_link column
ALTER TABLE posts ADD COLUMN IF NOT EXISTS project_link TEXT;
