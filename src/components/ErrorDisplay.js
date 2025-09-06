'use client';

export default function ErrorDisplay({ error, onClose }) {
  if (!error) return null;

  return (
    <div className="status-message status-error">
      <svg className="status-icon" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      <div className="flex-1">
        <strong>⚠️ Error:</strong> {error}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="btn btn-sm btn-error"
          style={{marginLeft: 'auto'}}
        >
          ✕ Dismiss
        </button>
      )}
    </div>
  );
}
