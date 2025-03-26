const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
dotenv.config();

// Convert environment variables to an object for webpack DefinePlugin
const env = Object.keys(process.env).reduce((acc, key) => {
  acc[`process.env.${key}`] = JSON.stringify(process.env[key]);
  return acc;
}, {});

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@ui-kitten/components']
      }
    },
    argv
  );
  
  // Add polyfills for modules that are not available in web
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-securecurestore': path.resolve(__dirname, './src/polyfills/securecurestore-web.js'),
  };

  // Add environment variables
  config.plugins.push(new webpack.DefinePlugin(env));

  // Configure optimization
  config.optimization = {
    ...config.optimization,
    minimize: true,
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  };

  return config;
}; 