const path = require("path");
const { resolve } = path;

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: [resolve("example")],
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@": resolve("./src"),
    },
  },
  devtool: "eval-source-map",
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "le5le-observable",
      filename: "index.html",
      template: "example/index.html",
    }),
  ],
};
