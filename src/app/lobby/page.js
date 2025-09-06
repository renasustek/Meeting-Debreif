'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/modern.css';

export default function MeetingLobby() {
  const router = useRouter();
  const [participants, setParticipants] = useState([]);
  const [emailInput, setEmailInput] = useState('');

  const addParticipant = () => {
    if (emailInput.trim() && emailInput.includes('@')) {
      const newParticipant = {
        id: Date.now(),
        email: emailInput.trim(),
        name: emailInput.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      };
      setParticipants([...participants, newParticipant]);
      setEmailInput('');
    }
  };

  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const startMeeting = () => {
    // Navigate to live meeting page with participants data
    const participantsData = encodeURIComponent(JSON.stringify(participants));
    router.push(`/live-meeting?participants=${participantsData}`);
  };

  return (
    <div className="app-container">
      <div className="main-container">
        {/* Header */}
        <div className="header">
          <h1 className="title">
            🎥 New Meeting
          </h1>
          <p className="subtitle">
            Set up your meeting participants and start your AI-powered meeting recording
          </p>
        </div>

        {/* Main Content */}
        <div className="card fade-in">
          <div className="card-body">
            {/* Participants Section */}
            <div className="mb-8">
              <h2 className="card-title mb-4">
                👥 Meeting Participants
              </h2>
              
              {/* Add Participant Form */}
              <div className="flex gap-3 mb-6">
                <div className="flex-1">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter participant email address"
                    className="form-input"
                    onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                  />
                </div>
                <button
                  onClick={addParticipant}
                  className="btn btn-primary"
                  disabled={!emailInput.trim() || !emailInput.includes('@')}
                >
                  ➕ Add Participant
                </button>
              </div>

              {/* Participants List */}
              <div className="space-y-3">
                {/* Host (You) */}
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      You
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        You (Host)
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Meeting organizer
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
                    Host
                  </div>
                </div>

                {/* Added Participants */}
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {participant.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {participant.email}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeParticipant(participant.id)}
                      className="btn btn-sm btn-error"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ))}

                {participants.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-2">👥</div>
                    <p>No participants added yet</p>
                    <p className="text-sm">Add participants by entering their email addresses above</p>
                  </div>
                )}
              </div>
            </div>

            {/* Meeting Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {participants.length + 1} participant{participants.length !== 0 ? 's' : ''} will join the meeting
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/')}
                  className="btn btn-secondary"
                >
                  ← Back to Upload
                </button>
                <button
                  onClick={startMeeting}
                  className="btn btn-lg btn-success"
                >
                  🎥 Start Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
