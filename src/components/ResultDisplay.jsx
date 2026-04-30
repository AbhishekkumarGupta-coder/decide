export default function ResultDisplay({ result, agent, rawData }) {
  if (!result) return null;

  return (
    <div className="result-display">
      <div className="result-hero">
        <div className="result-badge-row">
          {result.badge && (
            <span
              className="result-price-badge"
              style={result.badgeColor ? { background: result.badgeColor } : {}}
            >
              {result.badge}
            </span>
          )}
          {result.score && <span className="result-score-badge">{result.score}</span>}
          {result.confidence && (
            <span className="result-confidence">
              <span className="confidence-bar">
                <span
                  className="confidence-fill"
                  style={{ width: `${result.confidence}%` }}
                ></span>
              </span>
              {result.confidence}% confident
            </span>
          )}
        </div>
        <h3 className="result-headline">{result.headline}</h3>
        {result.subtitle && <p className="result-subtitle">{result.subtitle}</p>}
      </div>

      <div className="result-details">
        {result.details.map((detail, i) => (
          <div
            key={i}
            className={`result-detail-item ${
              detail.isWarning ? 'detail-warning' : ''
            } ${detail.isHighlight ? 'detail-highlight' : ''} ${
              detail.isAction ? 'detail-action' : ''
            } ${detail.isBadge ? 'detail-badge-type' : ''} ${
              detail.isList ? 'detail-list' : ''
            }`}
          >
            <span className="detail-label">{detail.label}</span>
            <div className="detail-value">
              {detail.isList ? (
                <pre className="detail-list-content">{detail.value}</pre>
              ) : detail.isBadge ? (
                <span className="detail-inline-badge">{detail.value}</span>
              ) : detail.isAction ? (
                <span className="detail-action-text">{detail.value}</span>
              ) : (
                <span>{detail.value}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Raw JSON toggle */}
      <details className="raw-json-toggle">
        <summary>View Raw JSON</summary>
        <pre className="raw-json">{JSON.stringify(rawData, null, 2)}</pre>
      </details>
    </div>
  );
}
