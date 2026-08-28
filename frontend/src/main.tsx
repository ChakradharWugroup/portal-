
if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
    window.location.href = window.location.href.replace('http:', 'https:');
}
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './i18n';
import './index.css';

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

const msalConfig = {
    auth: {
        clientId: "42181732-fc99-4f3a-9dd7-5f8979c80863",
        authority: "https://login.microsoftonline.com/A042FF5E-5F48-42AD-A080-37D73C9F6247",
        redirectUri: window.location.origin, 
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
    }
};

const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL BEFORE rendering 
msalInstance.initialize().then(() => {
    return msalInstance.handleRedirectPromise();
}).then((redirectResponse) => {
    if (redirectResponse) {
        console.log("Redirect login successful:", redirectResponse);
        if (redirectResponse.account) {
            msalInstance.setActiveAccount(redirectResponse.account);
        }
        sessionStorage.setItem('msal_just_redirected', 'true');
    }
}).catch((err) => {
    console.error("MSAL Redirect Error:", err);
}).finally(() => {
    // ALWAYS render React, even if MSAL threw a state mismatch error!
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <App />
        </MsalProvider>
      </React.StrictMode>,
    );
}).catch((err) => {
    // If MSAL fails to initialize (e.g., due to insecure context / missing crypto API)
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <div style={{ padding: '2rem', color: 'white', fontFamily: 'sans-serif', backgroundColor: '#0f172a', minHeight: '100vh' }}>
            <h1 style={{ color: '#ef4444' }}>Security Error: Insecure Connection</h1>
            <p>Microsoft Enterprise SSO requires a secure connection to load cryptographic modules.</p>
            <p>Because you are accessing this site via an insecure HTTP network IP (<strong>{window.location.origin}</strong>), your browser has disabled the required security APIs.</p>
            <br/>
            <h3>How to fix this:</h3>
            <ul>
                <li>If you are testing on this computer, use <a href="http://localhost:3004" style={{color: '#38bdf8'}}>http://localhost:3004</a> instead. (Browsers trust localhost).</li>
                <li>If you want other employees to access this over the network, your IT department must configure a secure <strong>HTTPS</strong> domain name (e.g. <i>https://portal.dahje.com</i>).</li>
            </ul>
            <br/>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Technical details: {err.message}</p>
        </div>
    );
});
