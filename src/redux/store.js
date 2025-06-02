import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import authReducer from './auth/auth.slice';

const encryptor = encryptTransform({
  secretKey: import.meta.env.VITE_SECRET_KEY,
  onError: function (error) {
    // Handle the error
    console.error('Encryption error:', error);
  },
});
// Redux persist configuration
const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptor],
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});
export const persistor = persistStore(store);
