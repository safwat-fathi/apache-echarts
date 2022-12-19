const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
// minimizers

// paths
const buildPath = path.resolve(__dirname, "dist/");
const publicPath = path.resolve(__dirname, "public/");
const entryPath = path.resolve(__dirname, "src/js", "index.ts");

const isProduction =
  process.argv[process.argv.indexOf("--mode") + 1] === "production";

module.exports = {
  // entry point
  entry: {
    index: entryPath,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  // output directory
  output: {
    path: buildPath,
    filename: "[name].bundle.js",
    publicPath: "",
  },
  // plugins
  plugins: [
    // provide jQuery & popper.js
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery",
    //   Popper: ["popper.js", "default"],
    // }),
    // provide HTML pages
    new HtmlWebPackPlugin({
      filename: "index.html",
      template: "public/index.html",
      minify: false,
    }),
    // new MiniCssExtractPlugin({
    //   filename: "[name].bundle.css",
    // }),
    // clean dist directory after every rebuild
    new CleanWebpackPlugin(),
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),
  ],
  // modules rules
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: ["html-loader"],
      },
      {
        test: /\.(ts)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  // optimization options
  optimization: {
    // minimize: false,
    // minimizer: [
    //   // this `...` syntax adds webpack optimization built-in plugins such as terser for js minification
    //   `...`,
    //   new CssMinimizerPlugin({
    //     exclude: /(node_modules)/,
    //   }),
    // ],
  },
  // development server
  devServer: {
    contentBase: buildPath,
    watchContentBase: true,
    hot: true,
    open: true,
    compress: true,
    port: 5000,
  },
};
