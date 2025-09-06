'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AudioFileUploader from '../components/AudioFileUploader';

export default function Home() {
  const searchParams = useSearchParams();
  const transcript = searchParams.get('transcript');
  const source = searchParams.get('source');

  useEffect(() => {                         
    // If we have a transcript from a meeting, we can handle it here                                                                  
    if (transcript && source === 'meeting') {
      console.log('Received transcript from meeting:', transcript.length, 'characters');
      // The AudioFileUploader component will handle displaying this transcript
    }
  }, [transcript, source]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AudioFileUploader initialTranscript={transcript} />
    </div>
  );
}
