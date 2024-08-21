"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _response = _interopRequireDefault(require("../../module/response"));

var productContoller = function productContoller(_ref) {
  var createProductUsecase = _ref.createProductUsecase,
      getAllProductUsecase = _ref.getAllProductUsecase,
      getProductUsecase = _ref.getProductUsecase,
      updateProductUsecase = _ref.updateProductUsecase,
      deleteProductUsecase = _ref.deleteProductUsecase;
  return {
    createProductController: function () {
      var _createProductController = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var productData, product;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                productData = req.body;
                _context.next = 4;
                return createProductUsecase(productData);

              case 4:
                product = _context.sent;
                return _context.abrupt("return", _response["default"].success(res, product, 200));

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                next(_context.t0);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 8]]);
      }));

      function createProductController(_x, _x2, _x3) {
        return _createProductController.apply(this, arguments);
      }

      return createProductController;
    }(),
    getProductController: function () {
      var _getProductController = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
        var productId, product;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                productId = req.params.productId;
                _context2.next = 4;
                return getProductUsecase(productId);

              case 4:
                product = _context2.sent;
                return _context2.abrupt("return", _response["default"].success(res, product, 200));

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](0);
                next(_context2.t0);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 8]]);
      }));

      function getProductController(_x4, _x5, _x6) {
        return _getProductController.apply(this, arguments);
      }

      return getProductController;
    }(),
    getAllProductController: function () {
      var _getAllProductController = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
        var _req$query, _req$query$page, page, _req$query$limit, limit, categories, product;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit, categories = _req$query.categories;
                _context3.next = 4;
                return getAllProductUsecase({
                  page: page,
                  limit: limit
                }, categories);

              case 4:
                product = _context3.sent;
                return _context3.abrupt("return", _response["default"].success(res, product, 200));

              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3["catch"](0);
                next(_context3.t0);

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 8]]);
      }));

      function getAllProductController(_x7, _x8, _x9) {
        return _getAllProductController.apply(this, arguments);
      }

      return getAllProductController;
    }(),
    updateProductController: function () {
      var _updateProductController = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
        var productData, productId, product;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                productData = req.body;
                productId = req.params.productId;
                _context4.next = 5;
                return updateProductUsecase({
                  productData: productData,
                  productId: productId
                });

              case 5:
                product = _context4.sent;
                return _context4.abrupt("return", _response["default"].success(res, product, 200));

              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4["catch"](0);
                next(_context4.t0);

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 9]]);
      }));

      function updateProductController(_x10, _x11, _x12) {
        return _updateProductController.apply(this, arguments);
      }

      return updateProductController;
    }(),
    deleteProductController: function () {
      var _deleteProductController = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
        var productId, product;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                productId = req.params.productId;
                _context5.next = 4;
                return deleteProductUsecase(productId);

              case 4:
                product = _context5.sent;
                return _context5.abrupt("return", _response["default"].success(res, product, 200));

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](0);
                next(_context5.t0);

              case 11:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 8]]);
      }));

      function deleteProductController(_x13, _x14, _x15) {
        return _deleteProductController.apply(this, arguments);
      }

      return deleteProductController;
    }()
  };
};

var _default = productContoller;
exports["default"] = _default;