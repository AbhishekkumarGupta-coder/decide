import { useState, useEffect } from 'react';
import Header from './components/Header';
import AgentCard from './components/AgentCard';
import AgentModal from './components/AgentModal';
import ApiKeyModal from './components/ApiKeyModal';
import agents from './agents/registry';
import { initGemini } from './services/gemini';
import { detectIntent } from './services/intentRouter';
import { getAgent } from './agents/registry';
import './index.css';

function App() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiReady, setApiReady] = useState(true);
  const [activeAgent, setActiveAgent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('decide_gemini_key');
    if (stored) {
      initGemini(stored);
      setApiReady(true);
    }
  }, []);

  const handleSaveApiKey = (key) => {
    initGemini(key);
    sessionStorage.setItem('decide_gemini_key', key);
    setApiReady(true);
    setShowApiKey(false);
  };

  const handleAgentClick = (agent) => {
    if (!apiReady) {
      setShowApiKey(true);
      return;
    }
    setActiveAgent(agent);
  };

  const handleInstantSearch = async (e) => {
    if (e.key !== 'Enter' || !searchQuery.trim()) return;
    const { agent: agentId } = await detectIntent(searchQuery);
    const agent = getAgent(agentId);
    if (agent) handleAgentClick(agent);
  };

  return (
    <div className="app">
      <Header
        onOpenApiKey={() => setShowApiKey(true)}
        isApiReady={apiReady}
      />

      <main className="main">

        {/* Hero */}
        <section className="hero">
          <div className="hero-badge">
            <span>🍴</span>
            <span>7 Smart Ordering Tools · Built for Swiggy</span>
          </div>

          <h2 className="hero-title">
            What are you<br />
            <span className="hero-gradient-text">hungry for?</span>
          </h2>

          <p className="hero-subtitle">
            Tell us your situation — solo, group, tight budget, or undecided.
            We'll find the perfect order for you instantly.
          </p>

          <div className="instant-search">
            <input
              type="text"
              placeholder="Try 'I'm hungry and broke' or 'we are 5 friends'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleInstantSearch}
              className="search-input"
            />
            <span className="search-hint">Press Enter — we'll open the right tool for you</span>
          </div>
        </section>

        {/* Agent Grid */}
        <section className="agents-section">
          <div className="agents-grid">
            {agents.map((agent, i) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                index={i}
                onClick={handleAgentClick}
              />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="how-it-works">
          <h3 className="section-title">How it works</h3>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Pick a tool</h4>
              <p>Choose from 7 ordering tools based on your situation right now</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Give context</h4>
              <p>Tell us your mood, budget, group size, or what you're about to order</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Get your order</h4>
              <p>One decisive recommendation — no scrolling, no overthinking, just food</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <p>
            <strong>Decide</strong> — Built for{' '}
            <a href="https://mcp.swiggy.com/builders" target="_blank" rel="noopener noreferrer">
              Swiggy Builders Club
            </a>
          </p>
          <p className="footer-sub">Smart ordering for everyone · Food · Groceries · Dining</p>
        </div>
      </footer>

      {activeAgent && (
        <AgentModal
          agent={activeAgent}
          onClose={() => setActiveAgent(null)}
          isApiReady={apiReady}
          onNeedApiKey={() => {
            setActiveAgent(null);
            setShowApiKey(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
