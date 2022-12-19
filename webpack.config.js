const path = require("path");

module.exports = {
  entry: {
    back: ["@babel/polyfill", "whatwg-fetch", "./back-end/index.jsx"],
    front: ["@babel/polyfill", "whatwg-fetch", "./front-end/index.jsx"]
  },

  output: {
    // path: `${__dirname}/dist/js`, // the files arent going into this folder... they are in the root (in memory)
    filename: "[name]-bundle.js",
    chunkFilename: "chunks/[name]-bundle.js",
    publicPath: "/" //path to chunks (from the page's perspective when it loads in the browser)
  },

  mode: "development",
  devServer: {
    contentBase: "./dist",
    open: true,
    proxy: {
      "/api": "http://74.208.182.189"
    },
    historyApiFallback: {
      rewrites: [{ from: "/back/*/", to: "/back/index.html" }]
    }
  },
  watch: true,
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
        test: /\.css$/,
        // exclude: /node_modules/,       there is a css file in node_modules/react-dates
        use: ["style-loader", "css-loader"]
      },

      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      Components: path.resolve(__dirname, "back-end/components"),
      Utils: path.resolve(__dirname, "back-end/utils")
      // these are also defined in jest.config.js
    }
  }
};
