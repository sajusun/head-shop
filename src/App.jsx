import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AppRoutes from './routes/AppRoutes';
import { setNotifications } from './features/notifications/notificationSlice';
import { fetchSettings } from './features/settings/settingsSlice';
import { mockNotifications } from './mock/notifications';
import './index.css';

function App() {
  useEffect(() => {
    // Initialize mock notifications
    // Fetch global site settings
    store.dispatch(fetchSettings());
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
