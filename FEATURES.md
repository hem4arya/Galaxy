# Galaxy Resume - Enhanced 2.5D Features 🌌✨

## 🎨 Visual Enhancements

### 2.5D Depth System
- **Multi-layer Parallax**: 5 distinct depth layers (nebulae, far stars, mid stars, near stars, particles)
- **3D Transforms**: CSS `translateZ()` for true depth perception
- **Perspective Camera**: 1000px perspective for immersive 3D feel
- **Depth-based Motion**: Each layer moves at different speeds based on depth

### Galaxy Canvas
- **300 Stars** across 3 depth layers with varying sizes and brightness
- **50 Animated Particles** with 3D floating motion
- **5 Nebula Clouds** with blur effects and slow drift animation
- **3 Shooting Stars** with randomized timing
- **Dynamic Background**: Smooth transition between dark space and light sky

### Planet Components (Projects)
- **3D Planet Spheres** with:
  - Radial gradient shading for depth
  - Surface texture with rotating animation
  - Atmospheric glow on hover
  - Dynamic shadows beneath planets
  - Orbital rings for important projects (importance ≥ 4)
  - Realistic highlight/shadow effects
  
- **Interactive Effects**:
  - Scale and lift on hover (translateZ)
  - Pulsing orbital ring indicator
  - Info card with smooth slide-up animation
  - Gentle orbital motion
  - Size based on project importance (75-175px)

### Project Modal
- **Enhanced Design**:
  - Gradient background with theme support
  - Decorative corner elements
  - Glowing backdrop effect matching project color
  - Rotating planet icon
  - Animated close button with rotation
  - Image zoom on hover
  - Ripple effect on buttons
  - Star rating system with twinkle animation
  
- **Smooth Transitions**:
  - Scale-in entrance animation
  - Backdrop blur effect
  - Staggered content reveal

## 🌓 Dark/Light Mode

### Theme Toggle
- **Celestial Animation**: Moon ↔ Sun transformation
- **Moon Features**:
  - Realistic craters
  - Soft glow effect
  - Subtle pulsing animation
  
- **Sun Features**:
  - 8 animated rays
  - Golden gradient
  - Pulsing glow effect
  
- **Smooth Transition**: 800ms spin animation when toggling

### Theme Effects
- **Dark Mode**:
  - Deep space gradient (#0a0e27 → #020308)
  - White stars with glow
  - Purple/blue nebulae
  - High contrast UI elements
  
- **Light Mode**:
  - Sky blue gradient (#87ceeb → #e0f6ff)
  - Subtle stars
  - Warm-toned nebulae
  - Softer shadows and borders

## 🎯 Custom Cursor

- **Dual-layer System**:
  - Small dot cursor (12px) with instant tracking
  - Larger trail ring (40px) with smooth follow
  
- **Interactive States**:
  - Normal: White dot with difference blend mode
  - Hover: Purple glow and scale up
  - Theme-aware colors
  
- **Smooth Animation**: Lerp interpolation for natural movement
- **Mobile**: Hidden on touch devices

## ✨ Advanced Animations

### Keyframe Animations
- `twinkle`: Stars pulsing and scaling
- `float3D`: 3D particle movement with depth
- `nebulaDrift`: Slow nebula movement
- `shootingStar`: Diagonal streak across sky
- `gentleOrbit`: Circular planet motion
- `rotateSurface`: Planet texture rotation
- `pulseRing`: Orbital ring expansion
- `titleFloat`: Floating title words
- `glowPulse`: Title glow breathing effect
- `iconFloat`: Bouncing icons
- `scroll`: Mouse wheel indicator

### Transition Effects
- Cubic-bezier easing for natural motion
- Staggered delays for sequential reveals
- Transform-based animations for performance
- Reduced motion support for accessibility

## 🎮 Interactive Elements

### Hero Section
- **Animated Title**: 4 words with individual float animations
- **Glowing Background**: Pulsing radial gradient
- **Scroll Indicator**: Animated mouse with wheel
- **Emoji Icons**: Floating sparkles and planets

### Info Cards
- **Real-time Stats**: Project count and total stars
- **Hover Effects**: Lift and glow
- **Animated Icons**: Bouncing emojis
- **Glass Morphism**: Backdrop blur with transparency

### Planets
- **Hover Info Card**: Detailed preview on hover
- **Tag Display**: First 3 tags shown
- **Smooth Transitions**: Cubic-bezier easing
- **Pause Orbit**: Animation pauses on hover

## 🎨 Visual Effects

### Shadows & Depth
- Multiple box-shadow layers for depth
- Inset shadows for concave surfaces
- Drop shadows for floating elements
- Dynamic shadows that respond to hover

### Blur & Filters
- Backdrop blur for glass effects
- Gaussian blur for nebulae and particles
- Drop-shadow filters for text
- Mix-blend-mode for cursor

### Gradients
- Radial gradients for spherical planets
- Linear gradients for backgrounds
- Multi-stop gradients for complexity
- Color-matched to project themes

## 📱 Responsive Design

- **Desktop**: Full 3D effects and custom cursor
- **Tablet**: Optimized perspective and sizing
- **Mobile**: Touch-friendly, simplified animations
- **Reduced Motion**: Respects user preferences

## 🚀 Performance Optimizations

- **will-change**: Hints for animated properties
- **transform**: GPU-accelerated animations
- **requestAnimationFrame**: Smooth 60fps motion
- **CSS containment**: Isolated rendering contexts
- **Lazy calculations**: Computed once, reused

## 🎯 Accessibility

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Screen reader friendly
- **Focus Indicators**: Visible focus states
- **Reduced Motion**: Disables animations when requested
- **Color Contrast**: WCAG AA compliant
- **Semantic HTML**: Proper heading hierarchy

## 🌟 User Experience

### Micro-interactions
- Hover states on all interactive elements
- Click feedback with scale/color changes
- Smooth state transitions
- Visual feedback for all actions

### Visual Hierarchy
- Size indicates importance
- Color coding for categories
- Depth for priority
- Animation for attention

### Immersive Feel
- Parallax creates depth
- Custom cursor enhances control
- Smooth animations feel natural
- Theme toggle adds personality

## 🎨 Color Palette

### Dark Mode
- Background: `#0a0e27` → `#020308`
- Primary: `#667eea` → `#764ba2`
- Accent: `#f093fb`, `#4facfe`, `#43e97b`
- Text: `rgba(255, 255, 255, 0.9)`

### Light Mode
- Background: `#87ceeb` → `#e0f6ff`
- Primary: `#4a5fd9` → `#5a3b82`
- Accent: Warmer versions of dark mode colors
- Text: `rgba(0, 0, 0, 0.8)`

## 🔧 Technical Stack

- **SvelteKit 5**: Latest features with runes
- **TypeScript**: Full type safety
- **CSS3**: Advanced animations and effects
- **Svelte Stores**: Reactive state management
- **Custom Animations**: Hand-crafted keyframes
- **Performance**: 60fps smooth animations

---

**Experience the galaxy at http://localhost:5173/** 🚀✨
