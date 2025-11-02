// Utility functions to generate unique planet colors and sizes

const PLANET_COLORS = [
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#84cc16', // Lime
  '#f97316', // Orange
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#a855f7', // Violet
  '#22c55e', // Green
  '#eab308', // Yellow
  '#e11d48', // Rose
  '#0ea5e9'  // Sky
];

const PLANET_SIZES = [
  { importance: 3, size: 'small' },
  { importance: 4, size: 'medium' },
  { importance: 5, size: 'large' },
  { importance: 2, size: 'tiny' },
  { importance: 6, size: 'huge' }
];

/**
 * Generate a deterministic color based on project ID
 * This ensures the same project always gets the same color
 */
export function generatePlanetColor(projectId: string): string {
  // Create a simple hash from the project ID
  let hash = 0;
  for (let i = 0; i < projectId.length; i++) {
    const char = projectId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash to select a color
  const colorIndex = Math.abs(hash) % PLANET_COLORS.length;
  return PLANET_COLORS[colorIndex];
}

/**
 * Generate a deterministic size/importance based on project characteristics
 * Ensures unique sizes by using project ID hash
 */
export function generatePlanetImportance(project: any): number {
  // Create a hash from the project ID for deterministic but varied results
  let hash = 0;
  const id = project.id?.toString() || '';
  
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get a number between 0-4
  const baseImportance = Math.abs(hash) % 5;
  
  // Add bonus points based on project characteristics
  const titleLength = project.title?.length || 0;
  const skillsCount = project.skills_used?.length || 0;
  const hasGithubLink = project.github_link ? 1 : 0;
  
  let bonus = 0;
  
  // Title length contributes to importance
  if (titleLength > 25) bonus += 1;
  
  // Skills count contributes to importance
  if (skillsCount > 4) bonus += 1;
  
  // Having a GitHub link adds importance
  bonus += hasGithubLink;
  
  // Calculate final importance (range 2-6)
  // baseImportance gives us 0-4, we add 2 to get 2-6
  const finalImportance = Math.min(6, baseImportance + 2 + Math.floor(bonus / 2));
  
  return finalImportance;
}

/**
 * Generate planet gradient based on color
 */
export function generatePlanetGradient(baseColor: string): string {
  // Create a lighter version of the base color for gradient
  const lighterColor = adjustColorBrightness(baseColor, 30);
  return `linear-gradient(135deg, ${baseColor} 0%, ${lighterColor} 100%)`;
}

/**
 * Adjust color brightness
 */
function adjustColorBrightness(color: string, percent: number): string {
  // Remove # if present
  const hex = color.replace('#', '');
  
  // Parse RGB values using substring instead of deprecated substr
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Adjust brightness
  const newR = Math.min(255, Math.max(0, r + (r * percent / 100)));
  const newG = Math.min(255, Math.max(0, g + (g * percent / 100)));
  const newB = Math.min(255, Math.max(0, b + (b * percent / 100)));
  
  // Convert back to hex
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}