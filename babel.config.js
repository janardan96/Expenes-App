module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@assets': './src/assets',
          '@features': './src/features',
          '@navigation': './src/Navigations',
          '@components': './src/components',
          '@screens': './src/screens',
          '@stores': './src/stores',
          '@context': './src/context',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
