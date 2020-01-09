const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  watch: true,
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|jpg|gif)(\?\S*)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets",
              name: "[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader" // translates CSS into CommonJS
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([{ from: "./src/assets", to: "assets" }]),
    new HtmlWebpackPlugin({ template: "./index.html" })
  ]
};
