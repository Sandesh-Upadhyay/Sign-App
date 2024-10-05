import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Add this basic CSS
const style = document.createElement('style');
style.textContent = `
  body, html {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);