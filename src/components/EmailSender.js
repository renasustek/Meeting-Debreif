'use client';

import { useState } from 'react';
import { validateEmails } from '../utils/validation';

export default function EmailSender({ 
  summary, 
  actionItems, 
  onSendEmail, 
  isSendingEmail, 
  emailSent 
}) {
  const [emailAddresses, setEmailAddresses] = useState('');

  const handleEmailChange = (e) => {
    setEmailAddresses(e.target.value);
  };

  const handleSendEmail = () => {
    if (!summary && actionItems.length === 0) {
      onSendEmail([], 'Please generate a summary first before sending emails');
      return;
    }

    if (!emailAddresses.trim()) {
      onSendEmail([], 'Please enter at least one email address');
      return;
    }

    const { emails, invalidEmails } = validateEmails(emailAddresses);
    
    if (invalidEmails.length > 0) {
      onSendEmail([], `Invalid email addresses: ${invalidEmails.join(', ')}`);
      return;
    }

    onSendEmail(emails);
  };

  return (
    <div className="email-section">
      <h3 className="email-title">
        📧 Share Meeting Insights
      </h3>
      <div className="email-form">
        <div className="form-group">
          <label htmlFor="email-input" className="form-label">
            Team Member Email Addresses
          </label>
          <input
            id="email-input"
            type="text"
            value={emailAddresses}
            onChange={handleEmailChange}
            placeholder="Enter email addresses separated by commas (e.g., john@company.com, jane@company.com)"
            className="form-input"
          />
          <p className="form-help">
            💡 Separate multiple email addresses with commas
          </p>
        </div>
        
        <div className="email-actions">
          <button
            onClick={handleSendEmail}
            disabled={isSendingEmail || !emailAddresses.trim() || (!summary && actionItems.length === 0)}
            className="btn btn-lg btn-warning"
          >
            {isSendingEmail ? (
              <>
                <div className="spinner" style={{width: '20px', height: '20px', borderWidth: '2px'}}></div>
                <span>📤 Sending Email...</span>
              </>
            ) : (
              <>
                <span>📧 Send Meeting Summary</span>
              </>
            )}
          </button>
          
          {emailSent && (
            <div className="email-success">
              <svg className="email-success-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>✅ Email sent successfully!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
