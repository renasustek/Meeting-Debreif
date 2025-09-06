# Meeting Debrief AI

A modern Next.js application that transforms audio meetings into actionable insights using AI-powered transcription and intelligent summarization.

## Features

- 🎤 **Audio Upload**: Drag-and-drop audio file upload with support for multiple formats
- 🤖 **AI Transcription**: Powered by Whisper AI for accurate speech-to-text conversion
- ✨ **Smart Summarization**: Gemini AI generates executive summaries and action items
- 📧 **Team Sharing**: Email meeting insights directly to team members
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Gemini AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- A running Whisper transcription service (Flask backend with ngrok)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd meeting-debrief
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   # Whisper Transcription API (ngrok URL)
   NEXT_PUBLIC_TRANSCRIPTION_API_URL=https://your-ngrok-url.ngrok-free.app/transcribe
   
   # Gemini AI API Key
   NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
   
   # Gemini AI Model URL
   NEXT_PUBLIC_GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Security

- ✅ API keys are stored in environment variables (`.env.local`)
- ✅ Environment files are gitignored to prevent accidental commits
- ✅ Client-side API calls use `NEXT_PUBLIC_` prefix for Next.js compatibility

## API Configuration

The application requires two external services:

1. **Whisper Transcription Service**: A Flask backend running Whisper AI for audio transcription
2. **Gemini AI**: Google's AI model for generating summaries and action items

Make sure both services are properly configured and accessible before using the application.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Meeting-Debreif
