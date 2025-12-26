-- Add order_index column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS order_index BIGINT DEFAULT 0;

-- Initialize order_index based on created_at (newer posts first, or just sequential)
-- This is a one-time setup
WITH sorted_posts AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn
  FROM posts
)
UPDATE posts
SET order_index = sorted_posts.rn
FROM sorted_posts
WHERE posts.id = sorted_posts.id;
