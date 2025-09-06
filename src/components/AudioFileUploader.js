'use client';

import { useState, useCallback, useRef } from 'react';

export default function AudioFileUploader() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Supported audio file types
  const supportedTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/m4a',
    'audio/aac',
    'audio/webm'
  ];

  const validateFile = (file) => {
    if (!supportedTypes.includes(file.type)) {
      throw new Error('Please upload a valid audio file (MP3, WAV, OGG, M4A, AAC, or WebM)');
    }
    
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 50MB');
    }
    
    return true;
  };

  const processFile = async (file) => {
    setIsProcessing(true);
    setError('');
    
    try {
      // Simulate file processing/transcription
      // In a real app, you would send this to your transcription API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock transcript - replace with actual transcription logic
      const mockTranscript = `This is a mock transcript for the uploaded audio file: "${file.name}". 
      
In a real implementation, this would contain the actual transcribed text from your audio file. You can edit this text as needed.

The transcription process would typically involve:
1. Uploading the audio file to a transcription service
2. Processing the audio to extract speech
3. Converting speech to text
4. Returning the transcript for editing and review.`;
      
      setTranscript(mockTranscript);
      setUploadedFile(file);
    } catch (err) {
      setError(err.message || 'Failed to process the audio file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = useCallback((file) => {
    try {
      validateFile(file);
      processFile(file);
    } catch (err) {
      setError(err.message);
    }
  }, []);

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

  const handleTranscriptChange = (e) => {
    setTranscript(e.target.value);
  };

  const resetUpload = () => {
    setTranscript('');
    setUploadedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Audio File Uploader
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload audio files to get transcripts. Supports drag-and-drop and manual file selection.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
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
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Processing Audio File
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we transcribe your audio...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Drop your audio file here
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  browse files
                </button>
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Supports MP3, WAV, OGG, M4A, AAC, WebM (max 50MB)
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded File Info */}
      {uploadedFile && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  File uploaded successfully
                </h3>
                <div className="mt-1 text-sm text-green-700 dark:text-green-300">
                  {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              </div>
            </div>
            <button
              onClick={resetUpload}
              className="text-green-600 hover:text-green-500 text-sm font-medium"
            >
              Upload another file
            </button>
          </div>
        </div>
      )}

      {/* Transcript Area */}
      {transcript && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Transcript
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {transcript.length} characters
            </div>
          </div>
          <textarea
            value={transcript}
            onChange={handleTranscriptChange}
            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="Your transcript will appear here..."
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => navigator.clipboard.writeText(transcript)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={() => {
                const blob = new Blob([transcript], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${uploadedFile?.name || 'transcript'}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Download Transcript
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
