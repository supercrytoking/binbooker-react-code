const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: ["syntax-dynamic-import", "transform-class-properties", "transform-async-to-generator"]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css/,
        // exclude: /node_modules/,       this is for react-dates, which is in node_modules
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)$/,
        use: [{ loader: "file-loader" }]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      Components: path.resolve(__dirname, "../back-end/components"),
      Utils: path.resolve(__dirname, "../back-end/utils")
      // these are also defined in jest.config.js
    }
  }
};
