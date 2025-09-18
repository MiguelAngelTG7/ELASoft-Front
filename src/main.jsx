import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App.jsx'
import { Analytics } from "@vercel/analytics/react";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
