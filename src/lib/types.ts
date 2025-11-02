export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  github?: string;
  linkedin?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 1-5
  x_position: number;
  y_position: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  tags: string[];
  importance: number; // 1-5, affects planet size
  x_position: number;
  y_position: number;
  color: string;
  created_at: string;
  published: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface ParallaxState {
  mouseX: number;
  mouseY: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
}
