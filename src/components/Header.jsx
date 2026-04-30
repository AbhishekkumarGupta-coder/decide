import { useState } from 'react';

export default function Header({ onOpenApiKey, isApiReady }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">
            <img src="https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_50/Logo_f5x7oc" 
                 alt="Swiggy" height="28" 
                 onError={(e) => { e.target.style.display='none'; }} />
            <span className="logo-divider">|</span>
            <h1 className="logo-text">Decide</h1>
          </div>
          <p className="header-tagline">Smart ordering for everyone</p>
        </div>

        <div className="header-actions">
          <div className={`api-status ${isApiReady ? 'ready' : 'not-ready'}`}>
            <span className="status-dot"></span>
            <span>{isApiReady ? 'Ready to order' : 'Setup needed'}</span>
          </div>
          <button className="btn-api-key" onClick={onOpenApiKey}>
            <span>⚙️</span>
            {isApiReady ? 'Settings' : 'Get Started'}
          </button>
        </div>
      </div>

      <div className="header-badge">
        <span>🍴</span>
        <span>Food · Groceries · Dining</span>
        <span className="badge-separator">•</span>
        <span>Swiggy Builders Club</span>
      </div>
    </header>
  );
}