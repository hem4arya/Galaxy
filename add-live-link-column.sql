-- Add live_link column to projects table
-- Run this in your Supabase SQL Editor

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS live_link TEXT;

-- Optional: Add a comment to document the column
COMMENT ON COLUMN projects.live_link IS 'URL to the live/deployed version of the project';
