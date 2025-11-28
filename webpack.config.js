const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  // 1. Context: Points to the 'src' folder for entry resolution
  context: path.resolve(__dirname, "src"),
  mode: "development",

  // 2. Entry: Points to your main app file inside src/
  entry: {
    app: "./app/app.js",
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },

  // 3. Development Server Settings
  devServer: {
    port: 9000,

    // 🔑 FIX 1: Open Brave Browser specifically
    // On macOS, the app name is 'Brave Browser'.
    // On Windows, you might need the full path to the .exe if 'Brave' doesn't work.
    open: {
      app: {
        name: "Brave Browser.app",
      },
    },

    // 🔑 FIX 2: Handle Client-Side Routing correctly
    historyApiFallback: true,

    static: {
      directory: path.join(__dirname, "dist"),
    },
  },

  module: {
    rules: [
      // SCSS Rules
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",

          // 🔑 CHANGE THIS SECTION
          {
            loader: "css-loader",
            options: {
              url: false, // 🛑 This tells Webpack: "Don't touch my background images!"
            },
          },

          "sass-loader",
        ],
      },
      // JS/Babel Rules
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      // Image/Asset Rules
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/img/[name].[ext]",
        },
      },
    ],
  },

  plugins: [
    new Dotenv({
      systemvars: true, // 🔑 Loads variables from Vercel's system environment
    }),

    // 🔑 FIX 3: Point to the correct Source HTML
    // We assume your source index.html is located at 'src/index.html'
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
      filename: "index.html",
      inject: "body",
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          // This looks for 'public' inside your project root
          from: path.resolve(__dirname, "public"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
  ],

  resolve: {
    extensions: [".js"],
  },
};
