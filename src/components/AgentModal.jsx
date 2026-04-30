import { useState } from 'react';
import ResultDisplay from './ResultDisplay';

import { runPipeline } from '../services/agentPipeline';
export default function AgentModal({ agent, onClose, isApiReady, onNeedApiKey }) {
  const [inputs, setInputs] = useState(() => {
    const defaults = {};
    agent.fields.forEach((f) => {
      if (f.type === 'range') defaults[f.key] = f.default || f.min || 1;
      else if (f.type === 'select') defaults[f.key] = f.options[0];
      else defaults[f.key] = '';
    });
    return defaults;
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const updateInput = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isApiReady) {
      onNeedApiKey();
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      
      const { primary, chain } = await runPipeline(agent.id, inputs);
      if (primary.success) {
        setResult(primary.data);
      } else {
        setError(primary.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const commonProps = {
      id: `field-${field.key}`,
      value: inputs[field.key] || '',
      onChange: (e) => updateInput(field.key, e.target.value),
      disabled: loading,
    };

    switch (field.type) {
      case 'text':
        return <input type="text" className="form-input" placeholder={field.placeholder} {...commonProps} />;
      case 'number':
        return (
          <input
            type="number"
            className="form-input"
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            {...commonProps}
          />
        );
      case 'textarea':
        return (
          <textarea
            className="form-textarea"
            placeholder={field.placeholder}
            rows={4}
            {...commonProps}
          />
        );
      case 'select':
        return (
          <select className="form-select" {...commonProps}>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'range':
        return (
          <div className="form-range-wrapper">
            <input
              type="range"
              className="form-range"
              min={field.min}
              max={field.max}
              {...commonProps}
              onChange={(e) => updateInput(field.key, parseInt(e.target.value))}
            />
            <span className="range-value">{inputs[field.key]}</span>
            <div className="range-labels">
              <span>{field.min}</span>
              <span>{field.max}</span>
            </div>
          </div>
        );
      default:
        return <input type="text" className="form-input" {...commonProps} />;
    }
  };

  const renderedResult = result ? agent.renderResult(result) : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ '--agent-color': agent.color, '--agent-gradient': agent.gradient }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-icon">{agent.icon}</span>
            <div>
              <h2 className="modal-title">{agent.name}</h2>
              <p className="modal-description">{agent.description}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Form */}
          {!result && (
            <form onSubmit={handleSubmit} className="agent-form">
              {agent.fields.map((field) => (
                <div key={field.key} className="form-group">
                  <label className="form-label" htmlFor={`field-${field.key}`}>
                    {field.label}
                  </label>
                  {renderField(field)}
                </div>
              ))}

              {error && (
                <div className="form-error">
                  <span>⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <span className="loading-content">
                    <span className="spinner"></span>
                    <span>Agent is thinking...</span>
                  </span>
                ) : (
                  <span className="submit-content">
                    <span>{agent.icon}</span>
                    <span>Run {agent.name} Agent</span>
                  </span>
                )}
              </button>
            </form>
          )}

          {/* Result */}
          {result && (
            <div className="result-section">
              <ResultDisplay result={renderedResult} agent={agent} rawData={result} />
              <div className="result-actions">
                <button
                  className="btn-retry"
                  onClick={() => {
                    setResult(null);
                    setError(null);
                  }}
                >
                  ← Try Again
                </button>
                <button className="btn-new" onClick={onClose}>
                  Try Another Agent
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
