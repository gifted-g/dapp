"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _response = _interopRequireDefault(require("../../module/response"));

var categoryContoller = function categoryContoller(_ref) {
  var createCategoryUsecase = _ref.createCategoryUsecase,
      getAllCategoryUsecase = _ref.getAllCategoryUsecase,
      updateCategoryUsecase = _ref.updateCategoryUsecase,
      deleteCategoryUsecase = _ref.deleteCategoryUsecase;
  return {
    createCategoryController: function () {
      var _createCategoryController = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var categoryData, category;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                categoryData = req.body;
                _context.next = 4;
                return createCategoryUsecase(categoryData);

              case 4:
                category = _context.sent;
                return _context.abrupt("return", _response["default"].success(res, category, 200));

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

      function createCategoryController(_x, _x2, _x3) {
        return _createCategoryController.apply(this, arguments);
      }

      return createCategoryController;
    }(),
    getAllCategoryController: function () {
      var _getAllCategoryController = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
        var categories;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return getAllCategoryUsecase();

              case 3:
                categories = _context2.sent;
                return _context2.abrupt("return", _response["default"].success(res, categories, 200));

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                next(_context2.t0);

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 7]]);
      }));

      function getAllCategoryController(_x4, _x5, _x6) {
        return _getAllCategoryController.apply(this, arguments);
      }

      return getAllCategoryController;
    }(),
    updateCategoryController: function () {
      var _updateCategoryController = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
        var categoryData, categoryId, category;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                categoryData = req.body;
                categoryId = req.params.categoryId;
                _context3.next = 5;
                return updateCategoryUsecase({
                  categoryData: categoryData,
                  categoryId: categoryId
                });

              case 5:
                category = _context3.sent;
                return _context3.abrupt("return", _response["default"].success(res, category, 200));

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](0);
                next(_context3.t0);

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 9]]);
      }));

      function updateCategoryController(_x7, _x8, _x9) {
        return _updateCategoryController.apply(this, arguments);
      }

      return updateCategoryController;
    }(),
    deleteCategoryController: function () {
      var _deleteCategoryController = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
        var categoryId, category;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                categoryId = req.params.categoryId;
                _context4.next = 4;
                return deleteCategoryUsecase(categoryId);

              case 4:
                category = _context4.sent;
                return _context4.abrupt("return", _response["default"].success(res, category, 200));

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](0);
                next(_context4.t0);

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 8]]);
      }));

      function deleteCategoryController(_x10, _x11, _x12) {
        return _deleteCategoryController.apply(this, arguments);
      }

      return deleteCategoryController;
    }()
  };
};

var _default = categoryContoller;
exports["default"] = _default;