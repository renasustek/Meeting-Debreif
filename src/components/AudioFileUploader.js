'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { transcribeAudio, generateSummary as generateSummaryAPI } from '../utils/api';
import { formatErrorMessage } from '../utils/validation';
import FileUpload from './FileUpload';
import TranscriptEditor from './TranscriptEditor';
import SummaryDisplay from './SummaryDisplay';
import ErrorDisplay from './ErrorDisplay';
import SuccessDisplay from './SuccessDisplay';
import '../styles/modern.css';

export default function AudioFileUploader({ initialTranscript }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [transcript, setTranscript] = useState(initialTranscript || '');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const [actionItems, setActionItems] = useState([]);
  const [isShared, setIsShared] = useState(false);

  // Get participants from URL parameters (if coming from meeting)
  const participantsParam = searchParams.get('participants');
  let meetingParticipants = [];
  
  try {
    if (participantsParam) {
      meetingParticipants = JSON.parse(decodeURIComponent(participantsParam));
    }
  } catch (err) {
    console.error('Error parsing participants:', err);
    meetingParticipants = [];
  }

  const handleFileSelect = async (file, validationError) => {
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      const transcriptResult = await transcribeAudio(file);
      setTranscript(transcriptResult);
      setUploadedFile(file);
    } catch (err) {
      console.error('Error during transcription:', err);
      setError(formatErrorMessage(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTranscriptChange = (newTranscript) => {
    setTranscript(newTranscript);
  };

  const handleGenerateSummary = async () => {
    if (!transcript.trim()) {
      setError('No transcript available to summarize');
      return;
    }

    setIsGeneratingSummary(true);
    setError('');

    try {
      const result = await generateSummaryAPI(transcript);
      setSummary(result.summary);
      setActionItems(result.actionItems);
    } catch (err) {
      console.error('Error during summary generation:', err);
      setError(formatErrorMessage(err));
    } finally {
      setIsGeneratingSummary(false);
    }
  };


  const resetUpload = () => {
    setTranscript('');
    setUploadedFile(null);
    setError('');
    setSummary('');
    setActionItems([]);
    setEmailSent(false);
  };

  const clearError = () => {
    setError('');
  };

  return (
    <div className="app-container">
      <div className="main-container">
        <div className="header">
          <h1 className="title">
            Meeting Debrief AI
          </h1>
          <p className="subtitle">
            Transform your audio meetings into actionable insights with AI-powered transcription and intelligent summarization
          </p>
          
          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => router.push('/lobby')}
              className="btn btn-lg btn-primary"
            >
              🎥 Start Live Meeting
            </button>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              or
            </div>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Upload existing audio file below
            </span>
          </div>
        </div>

        {/* File Upload Component */}
        <div className="card fade-in">
          <FileUpload 
            onFileSelect={handleFileSelect}
            isProcessing={isProcessing}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="fade-in">
            <ErrorDisplay 
              error={error}
              onClose={clearError}
            />
          </div>
        )}

        {/* Success Display */}
        {uploadedFile && (
          <div className="fade-in">
            <SuccessDisplay 
              uploadedFile={uploadedFile}
              onReset={resetUpload}
            />
          </div>
        )}

        {/* Transcript Editor */}
        {transcript && (
          <div className="card fade-in">
            <TranscriptEditor
              transcript={transcript}
              onTranscriptChange={handleTranscriptChange}
              uploadedFile={uploadedFile}
              onGenerateSummary={handleGenerateSummary}
              isGeneratingSummary={isGeneratingSummary}
            />
          </div>
        )}

        {/* Summary Display */}
        {(summary || actionItems.length > 0) && (
          <div className="card fade-in">
            <SummaryDisplay
              summary={summary}
              actionItems={actionItems}
              uploadedFile={uploadedFile}
            />
          </div>
        )}

        {/* Participants Indicator */}
        {meetingParticipants.length > 0 && (summary || actionItems.length > 0) && (
          <div className="card fade-in">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      📧 Meeting Summary Sent
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Delivered to {meetingParticipants.length} participant{meetingParticipants.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {meetingParticipants.slice(0, 3).map((participant, index) => (
                      <div
                        key={participant.id}
                        className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800"
                        title={participant.name}
                      >
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                    {meetingParticipants.length > 3 && (
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800">
                        +{meetingParticipants.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Participant List */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {meetingParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                    >
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{participant.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
