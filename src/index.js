import mapValues from 'lodash.mapvalues';
import pick from 'lodash.pick';

const allDispatchers = {};

function actions(namespace) {
  return function(action, ...args) {
    return { type: `${namespace}/${action}`, args };
  };
}

function dispatcher(namespace) {
  return function(name, handler) {
    allDispatchers[namespace][name] = handler;
  };
}

export function reduce(namespace, initialState, setup) {
  const reducers = {};

  function reducer(state = initialState, action) {
    const handler = reducers[action.type];

    if (!handler) {
      return state;
    }

    return handler(state, ...action.args);
  }

  reducer.update = function(setup) {
    setup(function(name, reducer) {
      reducers[`${namespace}/${name}`] = reducer;
    });

    return reducer;
  };

  return reducer.update(setup);
}

export function namespace(ns, setup) {
  if (allDispatchers[ns] === undefined) {
    allDispatchers[ns] = {};
  }

  setup(dispatcher(ns), actions(ns));

  function dispatchers(dispatch, picked) {
    let namespaceDispatchers = allDispatchers[ns];

    if (picked !== undefined) {
      namespaceDispatchers = pick(namespaceDispatchers, picked);
    }

    return mapValues(namespaceDispatchers, dispatcher =>
      function() { return dispatcher(dispatch, ...arguments); }
    );
  }

  dispatchers.mapToProps = function(dispatch) {
    return dispatchers(dispatch);
  };

  dispatchers.update = function(setup) {
    setup(dispatcher(ns), actions(ns));

    return dispatchers;
  };

  return dispatchers;
}
