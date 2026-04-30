export default function AgentCard({ agent, onClick, index }) {
  return (
    <button
      className="agent-card"
      onClick={() => onClick(agent)}
      style={{
        '--agent-color': agent.color,
        '--agent-gradient': agent.gradient,
        animationDelay: `${index * 0.08}s`,
      }}
    >
      <div className="agent-card-glow"></div>
      <div className="agent-card-content">
        <div className="agent-card-header">
          <span className="agent-icon">{agent.icon}</span>
          <span className="agent-id">Agent {index + 1}</span>
        </div>
        <h3 className="agent-name">{agent.name}</h3>
        <p className="agent-tagline">{agent.tagline}</p>
        <div className="agent-card-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}
