import type { Project } from '$lib/types';

// Static project data - no Supabase needed!
export const projectsData: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution',
    long_description: 'A comprehensive e-commerce platform built with modern web technologies. Features include user authentication, product management, shopping cart, payment integration with Stripe, real-time inventory tracking, and advanced analytics dashboard.',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis'],
    importance: 5,
    x_position: 50,
    y_position: 30,
    color: '#8b5cf6',
    published: true,
    demo_url: 'https://example.com',
    github_url: 'https://github.com',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Task Manager Pro',
    description: 'Collaborative task management app',
    long_description: 'A real-time collaborative task management application with drag-and-drop functionality, team collaboration features, progress tracking, time estimates, and Kanban boards. Built for teams of all sizes.',
    tags: ['Vue.js', 'Firebase', 'Tailwind', 'WebSocket'],
    importance: 4,
    x_position: 75,
    y_position: 45,
    color: '#ec4899',
    published: true,
    demo_url: 'https://example.com',
    github_url: 'https://github.com',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description: 'Real-time weather tracking',
    long_description: 'An interactive weather dashboard that provides real-time weather data, 7-day forecasts, beautiful visualizations, weather maps, and severe weather alerts using multiple weather APIs.',
    tags: ['Svelte', 'TypeScript', 'API', 'D3.js'],
    importance: 3,
    x_position: 70,
    y_position: 70,
    color: '#06b6d4',
    published: true,
    demo_url: 'https://example.com',
    github_url: 'https://github.com',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Portfolio Galaxy',
    description: 'Interactive portfolio website',
    long_description: 'A stunning portfolio website with smooth 3D animations, parallax effects, responsive design, dark/light mode, and an admin panel for content management. Built with SvelteKit and Supabase.',
    tags: ['SvelteKit', 'Supabase', 'Three.js'],
    importance: 5,
    x_position: 30,
    y_position: 70,
    color: '#10b981',
    published: true,
    demo_url: 'https://example.com',
    github_url: 'https://github.com',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'AI Chat Bot',
    description: 'Intelligent conversational AI',
    long_description: 'An advanced AI-powered chatbot with natural language processing, context awareness, multi-language support, and integration with various messaging platforms.',
    tags: ['Python', 'TensorFlow', 'NLP', 'FastAPI'],
    importance: 4,
    x_position: 25,
    y_position: 45,
    color: '#f59e0b',
    published: true,
    demo_url: 'https://example.com',
    github_url: 'https://github.com',
    created_at: new Date().toISOString()
  }
];

// Profile data
export const profileData = {
  about_text: 'Welcome to my cosmic portfolio! I\'m a passionate developer creating amazing experiences with modern web technologies. I specialize in building scalable applications, beautiful user interfaces, and innovative solutions.',
  hire_text: 'I\'m available for hire and exciting opportunities! Let\'s work together on your next project. I bring expertise in full-stack development, UI/UX design, and modern frameworks.',
  hire_form_link: 'https://forms.gle/VTqY4WynfDUTDfz68'
};
