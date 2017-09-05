'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduce = reduce;
exports.namespace = namespace;

var _lodash = require('lodash.mapvalues');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.pick');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var allDispatchers = {};

function actions(namespace) {
  return function (action) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return { type: namespace + '/' + action, args: args };
  };
}

function dispatcher(namespace) {
  return function (name, handler) {
    allDispatchers[namespace][name] = handler;
  };
}

function reduce(namespace, initialState, setup) {
  var reducers = {};

  function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    var handler = reducers[action.type];

    if (!handler) {
      return state;
    }

    return handler.apply(undefined, [state].concat(_toConsumableArray(action.args)));
  }

  reducer.update = function (setup) {
    setup(function (name, reducer) {
      reducers[namespace + '/' + name] = reducer;
    });

    return reducer;
  };

  return reducer.update(setup);
}

function namespace(ns, setup) {
  if (allDispatchers[ns] === undefined) {
    allDispatchers[ns] = {};
  }

  setup(dispatcher(ns), actions(ns));

  function dispatchers(dispatch, picked) {
    var namespaceDispatchers = allDispatchers[ns];

    if (picked !== undefined) {
      namespaceDispatchers = (0, _lodash4.default)(namespaceDispatchers, picked);
    }

    return (0, _lodash2.default)(namespaceDispatchers, function (dispatcher) {
      return function () {
        return dispatcher.apply(undefined, [dispatch].concat(Array.prototype.slice.call(arguments)));
      };
    });
  }

  dispatchers.mapToProps = function (dispatch) {
    return dispatchers(dispatch);
  };

  dispatchers.update = function (setup) {
    setup(dispatcher(ns), actions(ns));

    return dispatchers;
  };

  return dispatchers;
}