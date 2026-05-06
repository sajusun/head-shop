import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AppRoutes from './routes/AppRoutes';
import { setNotifications } from './features/notifications/notificationSlice';
import { mockNotifications } from './mock/notifications';
import './index.css';

function App() {
  useEffect(() => {
    // Initialize mock notifications
    store.dispatch(setNotifications(mockNotifications));
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
