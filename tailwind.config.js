/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    './App.tsx',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        primaryDark: 'var(--color-primary-dark)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        'dark-bg': 'var(--color-dark-bg)',
        'dark-bottomNav': 'var(--color-dark-bottomNav)',
        'dark-card': 'var(--color-darkCard)',
        BDPrimary: 'var(--color-border-primary)',
        'BDPrimary-dark': 'var(--color-border-primary-dark)',
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
