-- Migration script to rename category from "Blogs" to "Tech & Thoughts"
-- Run this in your Supabase SQL Editor

UPDATE posts 
SET category = 'Tech & Thoughts' 
WHERE category = 'Blogs';

-- Verify the update
SELECT category, COUNT(*) as count 
FROM posts 
GROUP BY category;
