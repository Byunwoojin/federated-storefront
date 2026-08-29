const {
  TextEncoder: NodeTextEncoder,
  TextDecoder: NodeTextDecoder,
} = require("util");

global.TextEncoder = NodeTextEncoder;
global.TextDecoder = NodeTextDecoder;

require("@testing-library/jest-dom");
