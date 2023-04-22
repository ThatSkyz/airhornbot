import CopyWebpackPlugin from 'copy-webpack-plugin';
import 'dotenv/config';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import { EnvironmentPlugin } from 'webpack';
import 'webpack-dev-server';
import { SubresourceIntegrityPlugin } from 'webpack-subresource-integrity';

const config: webpack.Configuration = {
  entry: './src/index.tsx',
  output: {
    filename: '[contenthash].js',
    path: path.resolve(__dirname, 'build', 'assets'),
    publicPath: `${process.env.WEBSITE_URL || ''}/assets/`,
    crossOriginLoading: 'anonymous',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      filename: '../index.html',
      meta: {
        url: process.env.WEBSITE_URL,
        'og:url': process.env.WEBSITE_URL,
      },
    }),
    new SubresourceIntegrityPlugin(),
    new EnvironmentPlugin(['WEBSITE_URL', 'WEBSITE_API_URL', 'DISCORD_CLIENT_ID']),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/robots.txt',
          to: '../robots.txt',
        },
        {
          from: 'public/404.html',
          to: '../404.html',
        },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
      },
      {
        test: /\.(styl)$/,
        use: ['style-loader', 'css-loader', 'stylus-loader'],
      },
      {
        test: /\.(png|svg|ogv|mp4|webm|wav)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
  },
};

export default config;
