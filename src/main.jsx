import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Apply theme from environment variable
const activeTheme = import.meta.env.VITE_APP_THEME || 'standard';
document.documentElement.setAttribute('data-theme', activeTheme);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
