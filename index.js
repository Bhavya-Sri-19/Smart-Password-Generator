import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // ✅ Bootstrap imported correctly
import ReactDOM from 'react-dom/client';       // ✅ React 18+ entry point
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
