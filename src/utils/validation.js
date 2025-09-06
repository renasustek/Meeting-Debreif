// Supported audio file types
export const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/m4a',
  'audio/aac',
  'audio/webm'
];

// File validation
export const validateAudioFile = (file) => {
  if (!SUPPORTED_AUDIO_TYPES.includes(file.type)) {
    throw new Error('Please upload a valid audio file (MP3, WAV, OGG, M4A, AAC, or WebM)');
  }
  
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    throw new Error('File size must be less than 50MB');
  }
  
  return true;
};

// Email validation
export const validateEmails = (emailString) => {
  const emails = emailString.split(',').map(email => email.trim()).filter(email => email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidEmails = emails.filter(email => !emailRegex.test(email));
  return { emails, invalidEmails };
};

// Error message formatting
export const formatErrorMessage = (error) => {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Network error: Unable to connect to the service. Please check your internet connection.';
  } else if (error.message.includes('API key')) {
    return 'API key error: Please check your API key configuration.';
  } else if (error.message.includes('JSON')) {
    return 'Response parsing error: The service returned an unexpected response format.';
  } else if (error.message.includes('CORS')) {
    return 'CORS error: The server is not allowing requests from this domain.';
  } else if (error.message.includes('404')) {
    return 'API endpoint not found. Please check if the endpoint is available.';
  } else if (error.message.includes('500')) {
    return 'Server error: There was an issue processing your request on the server.';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};
