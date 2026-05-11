import { useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export default function ResultDisplay({ result, agent, rawData }) {
  const [mcpResult, setMcpResult] = useState(null);
  const [mcpLoading, setMcpLoading] = useState(false);
  const [mcpError, setMcpError] = useState(null);

  if (!result) return null;

  const handlePlaceOrder = async () => {
    setMcpLoading(true);
    setMcpError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/swiggy/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: rawData?.dish || rawData?.meal || rawData?.decision || 'biryani',
          budget: 500,
        }),
      });
      const data = await response.json();
      setMcpResult(data);
    } catch (e) {
      setMcpError(e.message);
    } finally {
      setMcpLoading(false);
    }
  };

  const handleBookTable = async () => {
    setMcpLoading(true);
    setMcpError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/swiggy/book-table`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: rawData?.verdict || rawData?.dish || 'restaurant',
          guestCount: 2,
        }),
      });
      const data = await response.json();
      setMcpResult(data);
    } catch (e) {
      setMcpError(e.message);
    } finally {
      setMcpLoading(false);
    }
  };

  const handleGroceries = async () => {
    setMcpLoading(true);
    setMcpError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/swiggy/groceries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: rawData?.meal || 'groceries',
        }),
      });
      const data = await response.json();
      setMcpResult(data);
    } catch (e) {
      setMcpError(e.message);
    } finally {
      setMcpLoading(false);
    }
  };

  const getMcpButton = () => {
    switch (agent?.id) {
      case 'solo':
      case 'instant':
      case 'regret':
      case 'combo':
      case 'reorder':
        return (
          <button className="btn-mcp-order" onClick={handlePlaceOrder} disabled={mcpLoading}>
            {mcpLoading ? '⏳ Placing order...' : '🛵 Place Real Order on Swiggy'}
          </button>
        );
      case 'group':
        return (
          <button className="btn-mcp-order" onClick={handleBookTable} disabled={mcpLoading}>
            {mcpLoading ? '⏳ Booking...' : '🍽️ Book a Table on Dineout'}
          </button>
        );
      case 'budget':
        return (
          <button className="btn-mcp-order" onClick={handleGroceries} disabled={mcpLoading}>
            {mcpLoading ? '⏳ Finding...' : '🛒 Order on Instamart'}
          </button>
        );
      default:
        return null;
    }
  };

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

      {/* MCP Action Button */}
      <div className="mcp-action">
        {getMcpButton()}
      </div>

      {/* MCP Result */}
      {mcpResult && (
        <div className={`mcp-result ${mcpResult.success ? 'mcp-success' : 'mcp-error'}`}>
          {mcpResult.success ? (
            <>
              <p className="mcp-result-title">
                {mcpResult.recipe === 'book-table' ? '✅ Table Booked!' : '✅ Order Ready!'}
              </p>
              {mcpResult.restaurant && <p>🍴 {mcpResult.restaurant}</p>}
              {mcpResult.item && <p>🍛 {mcpResult.item}</p>}
              {mcpResult.product && <p>🛒 {mcpResult.product}</p>}
              {mcpResult.total && <p>💰 Total: ₹{mcpResult.total}</p>}
              {mcpResult.address && <p>📍 {mcpResult.address}</p>}
              {mcpResult.deliveryTime && <p>⏱️ {mcpResult.deliveryTime}</p>}
              {mcpResult.estimatedDelivery && <p>⏱️ {mcpResult.estimatedDelivery}</p>}
              {mcpResult.slot && <p>🕐 {mcpResult.slot}</p>}
              {mcpResult.confirmationCode && <p>🎫 Confirmation: {mcpResult.confirmationCode}</p>}
              {mcpResult.coupon && <p>🎟️ Coupon applied: {mcpResult.coupon}</p>}
              {mcpResult.mock && (
                <p className="mcp-mock-note">
                  ⚡ Demo mode — real orders live when Swiggy credentials arrive
                </p>
              )}
            </>
          ) : (
            <p className="mcp-error-text">❌ {mcpResult.error}</p>
          )}
        </div>
      )}

      {mcpError && <p className="mcp-error-text">❌ {mcpError}</p>}

      {/* Raw JSON toggle */}
      <details className="raw-json-toggle">
        <summary>View Raw JSON</summary>
        <pre className="raw-json">{JSON.stringify(rawData, null, 2)}</pre>
      </details>
    </div>
  );
}
