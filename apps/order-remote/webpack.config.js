const { createRemoteWebpackConfig } = require("../../packages/webpack-utils");

module.exports = createRemoteWebpackConfig({
  name: "order_remote",
  port: 3005,
  dirname: __dirname,
});
