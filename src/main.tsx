
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/* global Office */

Office.onReady((info: { host: Office.HostType; platform: Office.PlatformType }) => {
    // Only render if we are inside Word or if we are debugging in a browser
    // For local dev, sometimes host is not detected immediately or we want to run in browser
    const rootElement = document.getElementById('root');
    if (rootElement) {
        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    }
});
