'use client';

import { useState, useCallback, useRef } from 'react';
import { validateAudioFile } from '../utils/validation';

export default function FileUpload({ onFileSelect, isProcessing }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((file) => {
    try {
      validateAudioFile(file);
      onFileSelect(file);
    } catch (err) {
      // Error will be handled by parent component
      onFileSelect(file, err.message);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div
      className={`upload-area ${isDragOver ? 'drag-over' : ''} ${isProcessing ? 'processing' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isProcessing}
      />
      
      {isProcessing ? (
        <div className="processing-container">
          <div className="spinner"></div>
          <div>
            <h3 className="processing-title">
              🎵 Processing Your Audio
            </h3>
            <p className="processing-text">
              Our AI is transcribing your meeting with Whisper technology...
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="upload-icon">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div>
            <h3 className="upload-title">
              🎤 Upload Your Meeting Audio
            </h3>
            <p className="upload-text">
              Drag and drop your audio file here or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="browse-button"
              >
                browse files
              </button>
            </p>
          </div>
          <div className="file-types">
            📁 Supports MP3, WAV, OGG, M4A, AAC, WebM (max 50MB)
          </div>
        </div>
      )}
    </div>
  );
}
