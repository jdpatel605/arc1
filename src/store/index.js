import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import rootReducer from "./reducers/index";
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../saga';
import { composeWithDevTools } from 'redux-devtools-extension';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware()

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk, sagaMiddleware))
  );
  // Run the saga
  sagaMiddleware.run(rootSaga);

  return store;
}
