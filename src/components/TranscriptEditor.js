'use client';

export default function TranscriptEditor({ 
  transcript, 
  onTranscriptChange, 
  uploadedFile, 
  onGenerateSummary, 
  isGeneratingSummary 
}) {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
  };

  const handleDownloadTranscript = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${uploadedFile?.name || 'transcript'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card-body">
      <div className="flex items-center justify-between mb-4">
        <h2 className="card-title">
          📝 Meeting Transcript
        </h2>
        <div className="text-sm text-muted">
          {transcript.length} characters
        </div>
      </div>
      
      <div className="form-group">
        <textarea
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          className="form-textarea"
          placeholder="Your AI-generated transcript will appear here..."
        />
      </div>
      
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onGenerateSummary}
          disabled={isGeneratingSummary || !transcript.trim()}
          className={`btn btn-lg btn-success ${isGeneratingSummary || !transcript.trim() ? '' : ''}`}
        >
          {isGeneratingSummary ? (
            <>
              <div className="spinner" style={{width: '20px', height: '20px', borderWidth: '2px'}}></div>
              <span>🤖 Generating AI Summary...</span>
            </>
          ) : (
            <>
              <span>✨ Generate AI Summary</span>
            </>
          )}
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={handleCopyToClipboard}
            className="btn btn-secondary"
          >
            📋 Copy
          </button>
          <button
            onClick={handleDownloadTranscript}
            className="btn btn-primary"
          >
            💾 Download
          </button>
        </div>
      </div>
    </div>
  );
}
