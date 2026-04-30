import { useState } from 'react';

export default function ApiKeyModal({ onSave, onClose }) {
  const [key, setKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="apikey-modal" onClick={(e) => e.stopPropagation()}>
        <div className="apikey-header">
          <span className="apikey-icon">🔑</span>
          <h2>Connect Gemini API</h2>
          <p>Enter your Google Gemini API key to power the AI agents. Your key is stored only in this browser session.</p>
        </div>

        <form onSubmit={handleSubmit} className="apikey-form">
          <div className="form-group">
            <label className="form-label" htmlFor="apikey-input">API Key</label>
            <input
              id="apikey-input"
              type="password"
              className="form-input"
              placeholder="AIza..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              autoFocus
            />
          </div>

          <div className="apikey-help">
            <p>
              Get your free API key from{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                Google AI Studio →
              </a>
            </p>
          </div>

          <div className="apikey-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-connect" disabled={!key.trim()}>
              <span>⚡</span> Connect
            </button>
          </div>
        </form>

        <div className="apikey-security">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0110 0v4"></path>
          </svg>
          <span>Key never leaves your browser. Not stored on any server.</span>
        </div>
      </div>
    </div>
  );
}
