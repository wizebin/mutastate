module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
    }],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-syntax-dynamic-import',
  ],
};