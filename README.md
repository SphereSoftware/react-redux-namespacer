react-redux-namespacer
======================

redux logic organizer

## Installation

```
npm install --save redux-store-events
```

## Usage

### 1. Define dispatchers namespace

```js
// app/redux/todos.dispatchers.js
import { namespace } from 'react-redux-namespacer';

export default namespace('todos', (dispatcher, action) => {
  dispatcher('getTodos', (dispatch) => {
    get('/todos').then((response) => {
      dispatch(action('getTodosSuccess', response.data));
    });
  });
});
```

### 2. Define reducers for namespace

```js
// app/redux/todos.reducers.js
import { reduce } from 'react-redux-namespacer';

const initialState = {
  todos: [];
};

export default reduce('todos', initialState, (reducer) => {
  reducer('getTodosSuccess', (state, todos) => {
    return { ...state, todos };
  });
});
```

### 3. Combine reducers to create a store

```js
// app/redux/reducer.js
import { combineReducers } from 'redux';
import todos from './todos.reducer';
// ...

export default combineReducers({
  todos,
  // ...
});
```

### 4. Use dispatchers in your components

```js
// app/components/Todos.jsx
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dispatchers from 'app/redux/todos.dispatchers';

function mapStateToProps(state) {
  return state.todos;
}

class Todos extends PureComponent {
  static propTypes = {
    todos: PropTypes.arrayOf(PropTypes.object),
    getTodos: PropTypes.func
  };

  componentDidMount() {
    this.props.getTodos();
  }

  render() {
    // ...
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Todos);
```

## License

MIT
