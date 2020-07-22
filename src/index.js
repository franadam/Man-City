import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import authReducer from './store/reducers/auth';
import {saveState} from './store/localStorage';

import './index.css';
import App from './App';

const rootReducer = combineReducers({
  auth: authReducer
});

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: null || compose;
/* 
const persistConfig = {
  key: 'root', 20 juillet 9h30
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducer)

let store = createStore(persistedReducer);
let persistor = persistStore(store);
 */
const store = createStore(rootReducer,composeEnhancers(
    applyMiddleware(thunk)
));

//store.subscribe(() => {
//  saveState(store.getState())
//});

const app =  (
  <Provider store={store}>      
    <BrowserRouter >
        <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'))
