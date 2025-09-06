'use client';

import { useState } from 'react';
import { transcribeAudio, generateSummary as generateSummaryAPI, sendEmail as sendEmailAPI } from '../utils/api';
import { formatErrorMessage } from '../utils/validation';
import FileUpload from './FileUpload';
import TranscriptEditor from './TranscriptEditor';
import SummaryDisplay from './SummaryDisplay';
import EmailSender from './EmailSender';
import ErrorDisplay from './ErrorDisplay';
import SuccessDisplay from './SuccessDisplay';
import '../styles/modern.css';

export default function AudioFileUploader() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const [actionItems, setActionItems] = useState([]);
  const [emailSent, setEmailSent] = useState(false);

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

  const handleSendEmail = async (emails, errorMessage) => {
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setIsSendingEmail(true);
    setError('');

    try {
      await sendEmailAPI(emails, summary, actionItems);
      setEmailSent(true);
    } catch (err) {
      console.error('Error sending email:', err);
      setError(formatErrorMessage(err));
    } finally {
      setIsSendingEmail(false);
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

        {/* Email Sender */}
        {(summary || actionItems.length > 0) && (
          <div className="card fade-in">
            <EmailSender
              summary={summary}
              actionItems={actionItems}
              onSendEmail={handleSendEmail}
              isSendingEmail={isSendingEmail}
              emailSent={emailSent}
            />
          </div>
        )}
      </div>
    </div>
  );
}
