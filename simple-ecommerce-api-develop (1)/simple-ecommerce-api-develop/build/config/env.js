"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = require("dotenv");

(0, _dotenv.config)();
var config = {
  databaseUrl: {
    prod: process.env.MONGODB_PROD_URL,
    dev: process.env.MONGODB_DEV_URL,
    test: process.env.MONGODB_TEST_URL
  },
  PORT: process.env.PORT || 3000,
  JWTSecret: process.env.JWTSecret,
  nodeEnv: process.env.NODE_ENV
};
var _default = config;
exports["default"] = _default;