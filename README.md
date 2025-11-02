# Galaxy Resume - Interactive Portfolio

An interactive, galaxy-themed portfolio website built with SvelteKit. Features a stunning parallax effect, animated planets representing projects, and a beautiful space aesthetic.

## 🚀 Features

- **Interactive Galaxy Canvas**: Parallax effect that responds to mouse/touch movement
- **Planet Projects**: Each project is represented as a planet with hover effects and animations
- **Project Modals**: Click on planets to view detailed project information
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Smooth Animations**: Optimized animations with reduced motion support
- **TypeScript**: Fully typed for better development experience

## 📦 Installation

```bash
cd galaxy-resume
npm install
```

## 🔧 Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your Supabase credentials to `.env`:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Note: The app currently works with mock data, so Supabase is optional for now.

## 🏃 Running the App

Development mode:
```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📁 Project Structure

```
galaxy-resume/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── GalaxyCanvas.svelte    # Main galaxy background
│   │   │   ├── Planet.svelte          # Project planet component
│   │   │   └── ProjectModal.svelte    # Project details modal
│   │   ├── stores/
│   │   │   └── parallax.ts            # Parallax engine store
│   │   ├── utils/
│   │   │   ├── animations.ts          # Animation utilities
│   │   │   └── coordinates.ts         # Coordinate utilities
│   │   ├── types.ts                   # TypeScript interfaces
│   │   └── supabaseClient.ts          # Supabase client setup
│   ├── routes/
│   │   └── +page.svelte               # Main page
│   ├── app.css                        # Global styles
│   └── app.html                       # HTML template
├── .env                               # Environment variables
└── package.json
```

## 🎨 Customization

### Adding Projects

Edit the `projects` array in `src/routes/+page.svelte`:

```typescript
const projects: Project[] = [
  {
    id: '1',
    title: 'Your Project',
    description: 'Short description',
    long_description: 'Detailed description',
    tags: ['Tech', 'Stack'],
    importance: 5, // 1-5, affects planet size
    x_position: 30, // 0-100, horizontal position
    y_position: 40, // 0-100, vertical position
    color: '#667eea', // Planet color
    published: true,
    created_at: new Date().toISOString()
  }
];
```

### Customizing Colors

The galaxy theme uses these main colors:
- Background: `#0a0e27` to `#020308` (dark blue gradient)
- Accent: `#667eea` to `#764ba2` (purple gradient)
- Stars: White with varying opacity

You can modify these in the component styles.

## 🛠️ Tech Stack

- **SvelteKit**: Web framework
- **TypeScript**: Type safety
- **Supabase**: Backend (optional, for future phases)
- **Vite**: Build tool

## 📋 Implementation Status

### ✅ Completed Phases

- **Phase 0**: Project setup and dependencies
- **Phase 1**: Core infrastructure (types, utilities, Supabase client)
- **Phase 2**: Parallax engine with mouse/touch tracking
- **Phase 3**: Galaxy canvas with stars and particles
- **Phase 4**: Planet components with animations
- **Phase 6**: Project modal system

### 🚧 Future Phases

- Phase 5: Constellation system (skill connections)
- Phase 7: Supabase authentication
- Phase 8: Admin interface
- Phase 9: Row Level Security
- Phase 10: Final integration & optimization
- Phase 11: Testing & E2E

## 🎯 Next Steps

1. Set up Supabase database with tables for projects, skills, and messages
2. Implement constellation lines connecting skills to projects
3. Add authentication for admin panel
4. Create admin interface for content management
5. Add comprehensive testing

## 📝 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!
