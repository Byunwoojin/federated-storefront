const { createRemoteWebpackConfig } = require("../../packages/webpack-utils");

module.exports = createRemoteWebpackConfig({
  name: "ops_remote",
  port: 3006,
  dirname: __dirname,
});
