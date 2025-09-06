'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { transcribeAudio } from '../../utils/api';
import { formatErrorMessage } from '../../utils/validation';
import '../../styles/modern.css';

export default function LiveMeeting() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);
  const audioBlobRef = useRef(null);

  // Get participants from URL parameters
  const participantsParam = searchParams.get('participants');
  let addedParticipants = [];
  
  try {
    if (participantsParam) {
      addedParticipants = JSON.parse(decodeURIComponent(participantsParam));
    }
  } catch (err) {
    console.error('Error parsing participants:', err);
    addedParticipants = [];
  }
  
  // Create participants list with host (You) + added participants
  const participants = [
    { id: 1, name: 'You', isHost: true, isMuted: false, isVideoOn: true },
    ...addedParticipants.map(p => ({
      id: p.id,
      name: p.name,
      isHost: false,
      isMuted: Math.random() > 0.5, // Random mute status for demo
      isVideoOn: Math.random() > 0.3 // Random video status for demo
    }))
  ];

  // Auto-start recording when component mounts
  useEffect(() => {
    startRecording();
    
    return () => {
      // Cleanup on unmount
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      // Check supported MIME types
      const supportedTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/wav'
      ];
      
      let mimeType = 'audio/webm';
      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }
      
      console.log('Using MIME type:', mimeType);
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('Audio chunk received:', event.data.size, 'bytes');
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log('Audio blob created:', blob.size, 'bytes, type:', blob.type);
        audioBlobRef.current = blob;
        setAudioBlob(blob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      setError('Failed to access microphone. Please check your permissions.');
      console.error('Error accessing microphone:', err);
    }
  };

  // End meeting and process audio
  const endMeeting = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Wait for the onstop event to create the audio blob
      // We'll use a Promise to wait for the blob to be ready
      await waitForAudioBlob();
    } else {
      setError('No recording in progress. Please start a meeting first.');
    }
  };

  // Wait for audio blob to be created
  const waitForAudioBlob = () => {
    return new Promise((resolve, reject) => {
      const checkForBlob = () => {
        if (audioBlobRef.current) {
          console.log('Audio blob is ready:', audioBlobRef.current.size, 'bytes');
          processAndRedirect();
          resolve();
        } else {
          // Check again in 100ms
          setTimeout(checkForBlob, 100);
        }
      };
      
      // Start checking immediately
      checkForBlob();
      
      // Timeout after 5 seconds
      setTimeout(() => {
        if (!audioBlobRef.current) {
          setError('Failed to create audio recording. Please try again.');
          reject(new Error('Audio blob not created'));
        }
      }, 5000);
    });
  };

  // Process audio and redirect to debrief
  const processAndRedirect = async () => {
    const blob = audioBlobRef.current;
    if (!blob) {
      setError('No audio recording available. Please try again.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      console.log('Processing audio blob:', blob.size, 'bytes, type:', blob.type);
      
      // Create a File object from the blob
      const audioFile = new File([blob], 'meeting-recording.webm', { type: blob.type });
      console.log('Created audio file:', audioFile.name, audioFile.size, 'bytes');
      
      // Transcribe the audio using existing API
      console.log('Sending audio to transcription API...');
      const transcriptText = await transcribeAudio(audioFile);
      console.log('Transcription received:', transcriptText.length, 'characters');
      
      // Redirect to main page with transcript data
      router.push(`/?transcript=${encodeURIComponent(transcriptText)}&source=meeting`);

    } catch (err) {
      setError(formatErrorMessage(err));
      console.error('Error processing recording:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Error Display */}
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-red-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')} className="ml-4 text-white hover:text-gray-200">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center">
            <div className="spinner mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              🤖 Processing Your Meeting
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Transcribing audio and preparing your meeting debrief...
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <div>
            <h1 className="text-lg font-semibold">
              {isRecording ? '🔴 Meeting Live' : '⏹️ Meeting Ended'}
            </h1>
            <p className="text-sm text-gray-400">
              Duration: {formatTime(recordingTime)}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => router.push('/lobby')}
          className="btn btn-sm btn-secondary"
        >
          ← Back to Lobby
        </button>
      </div>

      {/* Main Video Grid */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          {/* Main video area */}
          <div className="md:col-span-2 lg:col-span-2 bg-gray-800 rounded-lg p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                You
              </div>
              <h2 className="text-xl font-semibold mb-2">You (Host)</h2>
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-400">
                  {isRecording ? 'Recording' : 'Not Recording'}
                </span>
              </div>
            </div>
          </div>

          {/* Participant thumbnails */}
          <div className="space-y-4">
            {participants.slice(1).map((participant) => (
              <div key={participant.id} className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                  {participant.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{participant.name}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {participant.isMuted && <span>🔇 Muted</span>}
                    {!participant.isVideoOn && <span>📹 Video Off</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{isRecording ? 'Recording' : 'Not Recording'}</span>
          </div>
          
          <div className="flex-1 text-center">
            <div className="text-2xl font-mono font-bold">
              {formatTime(recordingTime)}
            </div>
            <div className="text-sm text-gray-400">Meeting Duration</div>
          </div>
          
          <button
            onClick={endMeeting}
            disabled={isProcessing}
            className="btn btn-lg btn-error"
          >
            {isProcessing ? (
              <>
                <div className="spinner" style={{width: '20px', height: '20px', borderWidth: '2px'}}></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>⏹️ End Meeting</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
