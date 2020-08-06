const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MarkdownPlugin = require('markdown-html-webpack-plugin');
const AutoPrefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');

const PUB_DIR = path.resolve(__dirname, 'public');
const SRC_DIR = path.resolve(__dirname, 'src');

module.exports = (env, argv) => {
  const devMode = env !== 'production';

  return {
    devServer: {
      overlay: {
        warnings: true,
        errors: true
      },
      watchOptions: {
        poll: 500,
        ignore: /node_modules/,
      },
      historyApiFallback: {
        rewrites: [
          { from: /\.js$/, to: '/bundle.js' },
        ]
      },
      contentBase: PUB_DIR,
      disableHostCheck: true
    },
    entry: ['@babel/polyfill', `${SRC_DIR}/index.js`],
    output: {
      path: PUB_DIR,
      publicPath: '/',
      filename: 'bundle.js',
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: SRC_DIR,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-optional-chaining'],
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [AutoPrefixer],
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: `${SRC_DIR}/templates/index.html`,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(env),
        },
      }),
      new webpack.ContextReplacementPlugin(
        /highlight\.js\/lib\/languages$/,
        new RegExp(`^./(${['javascript', 'swift'].join('|')})$`),
      ),
    ],
  };
};
