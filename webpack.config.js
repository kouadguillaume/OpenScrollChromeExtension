const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    // Entry points for the extension
    entry: {
      background: './src/background.js',
      content: './src/content.js',
      popup: './src/popup.js',
    },

    // Output configuration
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true, // Clean the output directory before emit
    },

    // Development tools
    devtool: isProduction ? false : 'inline-source-map',

    // Module rules
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },

    // Plugins
    plugins: [
      // Copy static files to the output directory
      new CopyPlugin({
        patterns: [
          { from: 'public', to: '.', noErrorOnMissing: true },
          { from: 'manifest.json', to: '.', noErrorOnMissing: true },
          { from: 'icons', to: 'icons', noErrorOnMissing: true },
          { from: 'popup.html', to: '.', noErrorOnMissing: true },
          { from: 'styles', to: 'styles', noErrorOnMissing: true },
        ],
      }),
    ],

    // Performance optimizations for production
    optimization: {
      minimize: isProduction,
    },
  };
};
