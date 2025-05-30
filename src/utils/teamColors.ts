// Predefined team member colors with proper contrast
export const teamColors = [
  {
    name: 'indigo',
    bg: 'bg-indigo-500',
    text: 'text-indigo-500',
    border: 'border-indigo-500',
    light: 'bg-indigo-100',
    hex: '#6366F1',
  },
  {
    name: 'emerald',
    bg: 'bg-emerald-500',
    text: 'text-emerald-500',
    border: 'border-emerald-500',
    light: 'bg-emerald-100',
    hex: '#10B981',
  },
  {
    name: 'amber',
    bg: 'bg-amber-500',
    text: 'text-amber-500',
    border: 'border-amber-500',
    light: 'bg-amber-100',
    hex: '#F59E0B',
  },
  {
    name: 'rose',
    bg: 'bg-rose-500',
    text: 'text-rose-500',
    border: 'border-rose-500',
    light: 'bg-rose-100',
    hex: '#F43F5E',
  },
  {
    name: 'sky',
    bg: 'bg-sky-500',
    text: 'text-sky-500',
    border: 'border-sky-500',
    light: 'bg-sky-100',
    hex: '#0EA5E9',
  },
  {
    name: 'purple',
    bg: 'bg-purple-500',
    text: 'text-purple-500',
    border: 'border-purple-500',
    light: 'bg-purple-100',
    hex: '#A855F7',
  },
  {
    name: 'pink',
    bg: 'bg-pink-500',
    text: 'text-pink-500',
    border: 'border-pink-500',
    light: 'bg-pink-100',
    hex: '#EC4899',
  },
  {
    name: 'teal',
    bg: 'bg-teal-500',
    text: 'text-teal-500',
    border: 'border-teal-500',
    light: 'bg-teal-100',
    hex: '#14B8A6',
  },
  {
    name: 'orange',
    bg: 'bg-orange-500',
    text: 'text-orange-500',
    border: 'border-orange-500',
    light: 'bg-orange-100',
    hex: '#F97316',
  },
  {
    name: 'cyan',
    bg: 'bg-cyan-500',
    text: 'text-cyan-500',
    border: 'border-cyan-500',
    light: 'bg-cyan-100',
    hex: '#06B6D4',
  },
];

export const getNextAvailableColor = (usedColors: string[]) => {
  const availableColor = teamColors.find(
    (color) => !usedColors.includes(color.name)
  );
  return availableColor || teamColors[0]; // Fallback to first color if all are used
};