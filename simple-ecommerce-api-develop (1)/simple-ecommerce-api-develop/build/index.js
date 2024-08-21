"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("dotenv");

var _webserver = _interopRequireDefault(require("./infrastructures/webserver"));

var _router = _interopRequireDefault(require("./infrastructures/router"));

var _mongoose = _interopRequireDefault(require("./infrastructures/mongoose"));

var _repository = _interopRequireDefault(require("./infrastructures/repository"));

var _Database$getModels = _mongoose["default"].getModels(),
    User = _Database$getModels.User,
    Product = _Database$getModels.Product,
    Category = _Database$getModels.Category;

var userRepository = (0, _repository["default"])(User);
var productRepository = (0, _repository["default"])(Product);
var categoryRepository = (0, _repository["default"])(Category);
var router = (0, _router["default"])({
  userRepository: userRepository,
  productRepository: productRepository,
  categoryRepository: categoryRepository
});
var webserver = (0, _webserver["default"])(router);

var startServer = function startServer() {
  webserver.start();
};

var database = new _mongoose["default"]();
database.connect(startServer);