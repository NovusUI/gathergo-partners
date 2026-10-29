import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PublicApp from './public/PublicApp';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/^\/(event|food-bank|carpool|checkout|s)(\/|$)/.test(window.location.pathname) ? <PublicApp /> : <App />}
  </React.StrictMode>
);
