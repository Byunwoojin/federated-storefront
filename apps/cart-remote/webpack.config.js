const { createRemoteWebpackConfig } = require("../../packages/webpack-utils");

module.exports = createRemoteWebpackConfig({
  name: "cart_remote",
  port: 3004,
  dirname: __dirname,
});
