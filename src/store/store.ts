import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { rootReducer } from './reducer/rootReducer';

const persistConfig = {
    key: 'user',
    storage,
    whitelist: ['cartReducer', 'commonReducer', 'conversationReducer'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// use applyMiddleware to add the thunk middleware to the store
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export const configureStore = {
    store,
    persistor,
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;
