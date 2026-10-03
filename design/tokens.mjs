// Crapto Studio design tokens. Every rendered asset reads from here,
// so a palette or type change is a one-file edit followed by `npm run build`.
// Blues and oranges are sampled from the original logo files in brand/logo/source.

export const color = {
  cobalt: '#376BB1', // deep end of the logo's blue gradient
  blue: '#4296D1', // "Crapto Blue": logo core and wordmark
  sky: '#5AB4D9', // light end of the blue gradient
  ember: '#EC6C1C', // deep end of the orange spark gradient
  spark: '#F28D19', // accent orange, used sparingly
  amber: '#F4B310', // light end of the orange gradient
  midnight: '#0B1628', // dark background
  navy: '#13233D', // cards and raised surfaces on dark
  line: '#24395C', // borders and grid pattern on dark
  slate: '#93A9C6', // secondary text on dark
  mist: '#D4E5F2', // light background (from the original logo file)
  ink: '#0E1A2B', // text on light
  white: '#FFFFFF',
};

export const gradient = {
  brand: `linear-gradient(135deg, ${color.cobalt} 0%, ${color.blue} 55%, ${color.sky} 100%)`,
  spark: `linear-gradient(135deg, ${color.ember} 0%, ${color.spark} 50%, ${color.amber} 100%)`,
};

export const font = {
  display: "'Plus Jakarta Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

export const handle = '@craptostudio';
export const tagline = 'Ideas, compiled.';
