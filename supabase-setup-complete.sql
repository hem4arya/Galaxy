-- Complete Supabase setup for Galaxy Resume
-- Run this in your Supabase SQL editor

-- Enable Row Level Security on all tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON profile;
DROP POLICY IF EXISTS "Public read access" ON skills;
DROP POLICY IF EXISTS "Public read access" ON projects;
DROP POLICY IF EXISTS "Public read access on join table" ON project_skills;
DROP POLICY IF EXISTS "Admin full access" ON profile;
DROP POLICY IF EXISTS "Admin full access" ON skills;
DROP POLICY IF EXISTS "Admin full access" ON projects;
DROP POLICY IF EXISTS "Admin full access on join table" ON project_skills;
DROP POLICY IF EXISTS "Admin full access" ON messages;
DROP POLICY IF EXISTS "Public message insert" ON messages;

-- Public read access policies (for portfolio viewing)
CREATE POLICY "Public read access" ON profile
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON skills
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON project_skills
  FOR SELECT USING (true);

-- Admin full access policies (for authenticated users)
CREATE POLICY "Admin full access" ON profile
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access" ON skills
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access" ON projects
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access" ON project_skills
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access" ON messages
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Public insert for contact messages (future feature)
CREATE POLICY "Public message insert" ON messages
  FOR INSERT WITH CHECK (true);

-- Insert initial profile if it doesn't exist
INSERT INTO profile (about_text, hire_text, collab_text) 
SELECT 
  'Welcome to my cosmic portfolio! I''m a passionate developer creating amazing experiences in the digital universe.',
  'Available for hire - Let''s build something amazing together!',
  'Open to collaboration on exciting projects'
WHERE NOT EXISTS (SELECT 1 FROM profile);

-- Insert sample projects if table is empty
INSERT INTO projects (title, description, github_link, live_link, featured, x_position, y_position) 
SELECT * FROM (VALUES
  ('Galaxy Resume', 'An interactive cosmic portfolio with 3D effects and admin management', 'https://github.com/yourusername/galaxy-resume', 'https://yoursite.com', true, 50, 30),
  ('E-Commerce Platform', 'Full-stack e-commerce solution with modern web technologies', 'https://github.com/yourusername/ecommerce', 'https://ecommerce-demo.com', true, 25, 60),
  ('Task Manager Pro', 'Collaborative task management with real-time features', 'https://github.com/yourusername/taskmanager', 'https://taskmanager-demo.com', false, 75, 45),
  ('Weather Dashboard', 'Interactive weather tracking with beautiful visualizations', 'https://github.com/yourusername/weather', 'https://weather-demo.com', false, 70, 70),
  ('AI Chat Bot', 'Intelligent conversational AI with NLP capabilities', 'https://github.com/yourusername/chatbot', 'https://chatbot-demo.com', false, 25, 45)
) AS v(title, description, github_link, live_link, featured, x_position, y_position)
WHERE NOT EXISTS (SELECT 1 FROM projects);

-- Insert sample skills if table is empty
INSERT INTO skills (name, category, proficiency_level) 
SELECT * FROM (VALUES
  ('JavaScript', 'technical', 5),
  ('TypeScript', 'technical', 5),
  ('React', 'technical', 4),
  ('Svelte', 'technical', 5),
  ('Node.js', 'technical', 4),
  ('Python', 'technical', 4),
  ('PostgreSQL', 'technical', 4),
  ('Git', 'tool', 5),
  ('Docker', 'tool', 3),
  ('AWS', 'tool', 3),
  ('Problem Solving', 'soft', 5),
  ('Team Leadership', 'soft', 4)
) AS v(name, category, proficiency_level)
WHERE NOT EXISTS (SELECT 1 FROM skills);