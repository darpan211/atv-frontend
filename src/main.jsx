import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { persistor, store } from './redux/slice/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ErrorBoundary from './components/Home/ErrorBoundary.jsx';
// import { Provider } from 'react-redux';
// import { store } from './redux/store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename="/">
        <Provider store={store}>
          <PersistGate loading={<div>Loading State...</div>} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
