const path = require("path");

const {
  ModuleFederationPlugin,
} = require("@module-federation/enhanced/webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { remotes } = require("./src/remotes.config.js");

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";

  const mfRemotes = Object.fromEntries(
    remotes.map((r) => [r.name, `${r.name}@${isDev ? r.devUrl : r.prodUrl}`]),
  );

  return {
    entry: "./src/index.ts",
    mode: isDev ? "development" : "production",
    devServer: {
      port: 3000,
      historyApiFallback: true,
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "host",
        remotes: mfRemotes,
        dts: false,
        shared: {
          react: { singleton: true },
          "react-dom": { singleton: true },
          "react-router-dom": { singleton: true },
          "@mfe/cart-store": { singleton: true },
        },
      }),
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
    ],
  };
};
