-- Fixed Supabase setup for Galaxy Resume
-- Based on actual table structure from supbase-structure.csv

-- Enable Row Level Security on all tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON profile;
DROP POLICY IF EXISTS "Public read access" ON skills;
DROP POLICY IF EXISTS "Public read access" ON projects;
DROP POLICY IF EXISTS "Admin full access" ON profile;
DROP POLICY IF EXISTS "Admin full access" ON skills;
DROP POLICY IF EXISTS "Admin full access" ON projects;
DROP POLICY IF EXISTS "Admin full access" ON messages;
DROP POLICY IF EXISTS "Public message insert" ON messages;

-- Public read access policies (for portfolio viewing)
CREATE POLICY "Public read access" ON profile
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON skills
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON projects
  FOR SELECT USING (true);

-- Admin full access policies (for authenticated users)
CREATE POLICY "Admin full access" ON profile
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access" ON skills
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access" ON projects
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access" ON messages
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Public insert for contact messages
CREATE POLICY "Public message insert" ON messages
  FOR INSERT WITH CHECK (true);

-- Add missing columns to projects table if they don't exist
DO $$ 
BEGIN
    -- Add live_link column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'live_link') THEN
        ALTER TABLE projects ADD COLUMN live_link text;
    END IF;
    
    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'image_url') THEN
        ALTER TABLE projects ADD COLUMN image_url text;
    END IF;
    
    -- Add featured column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'featured') THEN
        ALTER TABLE projects ADD COLUMN featured boolean DEFAULT false;
    END IF;
    
    -- Add x_position column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'x_position') THEN
        ALTER TABLE projects ADD COLUMN x_position numeric(5,2) DEFAULT 50.00;
    END IF;
    
    -- Add y_position column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'y_position') THEN
        ALTER TABLE projects ADD COLUMN y_position numeric(5,2) DEFAULT 50.00;
    END IF;
END $$;

-- Add missing columns to skills table if they don't exist
DO $$ 
BEGIN
    -- Add category column if it doesn't exist (rename from 'type' if needed)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'skills' AND column_name = 'category') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'skills' AND column_name = 'type') THEN
            ALTER TABLE skills RENAME COLUMN type TO category;
        ELSE
            ALTER TABLE skills ADD COLUMN category text DEFAULT 'technical';
        END IF;
    END IF;
    
    -- Add proficiency_level column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'skills' AND column_name = 'proficiency_level') THEN
        ALTER TABLE skills ADD COLUMN proficiency_level integer DEFAULT 3 CHECK (proficiency_level BETWEEN 1 AND 5);
    END IF;
    
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'skills' AND column_name = 'created_at') THEN
        ALTER TABLE skills ADD COLUMN created_at timestamp with time zone DEFAULT NOW();
    END IF;
END $$;

-- Add missing columns to messages table if they don't exist
DO $$ 
BEGIN
    -- Rename sender_name to name if needed
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'messages' AND column_name = 'sender_name') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'messages' AND column_name = 'name') THEN
            ALTER TABLE messages RENAME COLUMN sender_name TO name;
        END IF;
    END IF;
    
    -- Rename sender_email to email if needed
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'messages' AND column_name = 'sender_email') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'messages' AND column_name = 'email') THEN
            ALTER TABLE messages RENAME COLUMN sender_email TO email;
        END IF;
    END IF;
    
    -- Rename body to message if needed
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'messages' AND column_name = 'body') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'messages' AND column_name = 'message') THEN
            ALTER TABLE messages RENAME COLUMN body TO message;
        END IF;
    END IF;
    
    -- Add subject column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'messages' AND column_name = 'subject') THEN
        ALTER TABLE messages ADD COLUMN subject text;
    END IF;
    
    -- Add read column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'messages' AND column_name = 'read') THEN
        ALTER TABLE messages ADD COLUMN read boolean DEFAULT false;
    END IF;
END $$;

-- Insert initial profile if it doesn't exist
INSERT INTO profile (about_text, hire_text, collab_text) 
SELECT 
  'Welcome to my cosmic portfolio! I''m a passionate developer creating amazing experiences in the digital universe.',
  'Available for hire - Let''s build something amazing together!',
  'Open to collaboration on exciting projects'
WHERE NOT EXISTS (SELECT 1 FROM profile);

-- Insert sample projects if table is empty (using UUID for id)
INSERT INTO projects (id, title, description, github_link, live_link, featured, x_position, y_position, skills_used) 
SELECT 
  gen_random_uuid(),
  v.title,
  v.description,
  v.github_link,
  v.live_link,
  v.featured,
  v.x_position,
  v.y_position,
  v.skills_used
FROM (VALUES
  ('Galaxy Resume', 'An interactive cosmic portfolio with 3D effects and admin management', 'https://github.com/yourusername/galaxy-resume', 'https://yoursite.com', true, 50, 30, ARRAY['SvelteKit', 'Supabase', 'TypeScript']),
  ('E-Commerce Platform', 'Full-stack e-commerce solution with modern web technologies', 'https://github.com/yourusername/ecommerce', 'https://ecommerce-demo.com', true, 25, 60, ARRAY['React', 'Node.js', 'MongoDB']),
  ('Task Manager Pro', 'Collaborative task management with real-time features', 'https://github.com/yourusername/taskmanager', 'https://taskmanager-demo.com', false, 75, 45, ARRAY['Vue.js', 'Firebase']),
  ('Weather Dashboard', 'Interactive weather tracking with beautiful visualizations', 'https://github.com/yourusername/weather', 'https://weather-demo.com', false, 70, 70, ARRAY['JavaScript', 'API']),
  ('AI Chat Bot', 'Intelligent conversational AI with NLP capabilities', 'https://github.com/yourusername/chatbot', 'https://chatbot-demo.com', false, 25, 45, ARRAY['Python', 'TensorFlow'])
) AS v(title, description, github_link, live_link, featured, x_position, y_position, skills_used)
WHERE NOT EXISTS (SELECT 1 FROM projects);

-- Insert sample skills if table is empty
INSERT INTO skills (name, category, proficiency_level) 
SELECT * FROM (VALUES
  ('JavaScript', 'technical', 5),
  ('TypeScript', 'technical', 5),
  ('React', 'technical', 4),
  ('Svelte', 'technical', 5),
  ('SvelteKit', 'technical', 5),
  ('Vue.js', 'technical', 4),
  ('Node.js', 'technical', 4),
  ('Python', 'technical', 4),
  ('PostgreSQL', 'technical', 4),
  ('MongoDB', 'technical', 3),
  ('Firebase', 'technical', 3),
  ('Supabase', 'technical', 4),
  ('TensorFlow', 'technical', 3),
  ('Git', 'tool', 5),
  ('API', 'tool', 4),
  ('Docker', 'tool', 3),
  ('AWS', 'tool', 3),
  ('Problem Solving', 'soft', 5),
  ('Team Leadership', 'soft', 4)
) AS v(name, category, proficiency_level)
WHERE NOT EXISTS (SELECT 1 FROM skills);