"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _response = _interopRequireDefault(require("../../module/response"));

var userContoller = function userContoller(_ref) {
  var createUserUsecase = _ref.createUserUsecase,
      loginUserUsecase = _ref.loginUserUsecase;
  return {
    createUser: function () {
      var _createUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var userData, user;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                userData = req.body;
                _context.next = 4;
                return createUserUsecase(userData);

              case 4:
                user = _context.sent;
                return _context.abrupt("return", _response["default"].success(res, user, 200));

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

      function createUser(_x, _x2, _x3) {
        return _createUser.apply(this, arguments);
      }

      return createUser;
    }(),
    loginUser: function () {
      var _loginUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
        var data, user;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                data = req.body;
                _context2.next = 4;
                return loginUserUsecase(data);

              case 4:
                user = _context2.sent;
                return _context2.abrupt("return", _response["default"].success(res, user, 200));

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

      function loginUser(_x4, _x5, _x6) {
        return _loginUser.apply(this, arguments);
      }

      return loginUser;
    }()
  };
};

var _default = userContoller;
exports["default"] = _default;