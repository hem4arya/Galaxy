-- Add hire_form_link column to profile table
-- Run this in your Supabase SQL Editor

ALTER TABLE profile 
ADD COLUMN IF NOT EXISTS hire_form_link TEXT DEFAULT 'https://forms.gle/VTqY4WynfDUTDfz68';

-- Optional: Add a comment to document the column
COMMENT ON COLUMN profile.hire_form_link IS 'URL to the hire/contact form (Google Form or similar)';
