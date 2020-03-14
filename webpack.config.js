const path = require('path');
const webpack = require('webpack'); // to access built-in plugins
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'production' ? false : true;

var main = {
  mode: IS_DEVELOPMENT ? 'development': 'production',
  devtool: IS_DEVELOPMENT ? 'source-map' : 'none',
  target: 'electron-main',
  externals: [
    nodeExternals(),
  ],

  entry: path.join(__dirname, 'src', 'main'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  node: {
    __dirname: false,
    __filename: false
  },
  module: {
    rules: [{
      test: /.ts?$/,
      include: [
        path.resolve(__dirname, 'src'),
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules'),
      ],
      loader: 'ts-loader',
    }]
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ["**/*"]}),
    new CopyWebpackPlugin(
      [
        {
          from: './',
          to: './',
        },
      ],
      { context: 'icons/icon.png' }
    ),
    new CopyWebpackPlugin([{from: './', to: './'}], {context: 'src/index.html'}),
    // 環境変数をセット
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.FILE_PREFIX': JSON.stringify('electron'),
      'process.env.PORT': JSON.stringify(process.env.PORT),
    }),
  ]
};


module.exports = [
  main
];