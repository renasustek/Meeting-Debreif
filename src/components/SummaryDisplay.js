'use client';

export default function SummaryDisplay({ summary, actionItems, uploadedFile }) {
  const handleCopySummary = () => {
    const summaryText = `Summary:\n${summary}\n\nAction Items:\n${actionItems.map((item, index) => `${index + 1}. ${item}`).join('\n')}`;
    navigator.clipboard.writeText(summaryText);
  };

  const handleDownloadSummary = () => {
    const summaryText = `Summary:\n${summary}\n\nAction Items:\n${actionItems.map((item, index) => `${index + 1}. ${item}`).join('\n')}`;
    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${uploadedFile?.name || 'meeting'}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card-body">
      <h2 className="card-title mb-5">
        🎯 AI-Generated Meeting Insights
      </h2>
      
      {/* Summary Section */}
      {summary && (
        <div className="summary-section">
          <h3 className="summary-title">
            📋 Executive Summary
          </h3>
          <div className="summary-content">
            {summary}
          </div>
        </div>
      )}

      {/* Action Items Section */}
      {actionItems.length > 0 && (
        <div className="action-items-section">
          <h3 className="action-items-title">
            ✅ Action Items
          </h3>
          <ul className="action-items-list">
            {actionItems.map((item, index) => (
              <li key={index} className="action-item">
                <div className="action-item-bullet"></div>
                <span className="action-item-text">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons for Summary */}
      <div className="flex justify-end gap-3 mt-5">
        <button
          onClick={handleCopySummary}
          className="btn btn-secondary"
        >
          📋 Copy Summary
        </button>
        <button
          onClick={handleDownloadSummary}
          className="btn btn-success"
        >
          💾 Download Summary
        </button>
      </div>
    </div>
  );
}
