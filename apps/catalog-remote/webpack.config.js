const { createRemoteWebpackConfig } = require("../../packages/webpack-utils");

module.exports = createRemoteWebpackConfig({
  name: "catalog_remote",
  port: 3003,
  dirname: __dirname,
});
