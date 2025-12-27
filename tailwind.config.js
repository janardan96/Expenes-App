/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    './App.tsx',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
      },
      fontFamily: {
        inter: ['Inter-Regular', 'system-ui', '-apple-system', 'sans-serif'],
        'inter-black': ['Inter-Black'],
        bold: ['Inter-Bold'],
        extrabold: ['Inter-ExtraBold'],
        extralight: ['Inter-ExtraLight'],
        light: ['Inter-Light'],
        medium: ['Inter-Medium'],
        regular: ['Inter-Regular'],
        semibold: ['Inter-SemiBold'],
        thin: ['Inter-Thin'],
      },
    },
  },
  plugins: [],
};
