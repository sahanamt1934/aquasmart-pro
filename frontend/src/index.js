import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // 🌍 LOAD TRANSLATIONS FIRST

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Suspense is the key to fixing the null 'useContext' error */}
    <Suspense fallback={<div style={{padding: '40px', textAlign: 'center'}}>Loading AquaSmart Pro...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);