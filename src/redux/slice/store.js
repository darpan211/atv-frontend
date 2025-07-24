import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import authReducer from './auth/authSlice';
import categoryReducer from './categories/categorySlice';
import colorReducer from './colors/colorSlice';
import materialReducer from './material/materialSlice';
import seriesReducer from './series/seriesSlice';
import sizesReducer from './sizes/sizeSlice';
import suitablePlaceReducer from './suitablePlace/suitablePlaceSlice';
import tileReducer from './tiles/tileSlice';
import sellerReducer from './seller/sellerSlice';
import finishReducer from './finish/finishSlice';
import adminReducer from './admin/adminSlice';
import roomsReducer from './room/roomSlice';
import filterReducer from './sidebarfilter/filterSlice';
import configReducer from './config/configSlice';
import dashboardReducer from '../slice/dashboard/dashboardSlice';
import matchReducer from './matchTiles/matchSlice';
const encryptor = encryptTransform({
  secretKey: import.meta.env.VITE_SECRET_KEY,
  onError: function (error) {
    console.error('Encryption error:', error);
  },
});

const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptor],
  blacklist: ['match'],
};

const appReducer = combineReducers({
  auth: authReducer,
  categories: categoryReducer,
  colors: colorReducer,
  materials: materialReducer,
  series: seriesReducer,
  sizes: sizesReducer,
  suitablePlace: suitablePlaceReducer,
  tiles: tileReducer,
  seller: sellerReducer,
  admin: adminReducer,
  finish: finishReducer,
  rooms: roomsReducer,
  filters: filterReducer,
  config: configReducer,
  dashboard: dashboardReducer,
  match: matchReducer,
});

// Reset all state on logout
const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    state = undefined;
  }
  return appReducer(state, action);
};

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