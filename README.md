AI-Powered Meeting Debrief
Project Overview
This is an AI-first, full-stack web application I created to showcase my ability to use AI to increase my effciency.

This entire project, from initial concept to a functional prototype, was conceived and developed in under 3 hours. It serves as a proof of concept for the "AI-first" development approach, showcasing how an engineer can leverage generative AI models and tools to act as a force multiplier, accelerating development speed without sacrificing quality.

✨ Key Features
Mock Meeting Interface: A simplified, Google Meets-style UI that records voice during a mock meeting.

Automated Transcription: Automatically transcribes the recorded audio using an open-source model.

Intelligent Summarization: Uses the Gemini API to generate a concise summary and a list of actionable tasks from the transcript.

Responsive & Professional Design: The UI is designed to be modern and professional, inspired by a clean, bold aesthetic.

🧠 The AI-First Development Process
This project was built with Cursor, an AI-first code editor, as the primary development tool. My role was not just to write code, but to effectively prompt, guide, and debug the AI's output. This process demonstrates a key skill for a modern engineer: the ability to leverage AI to handle boilerplate and complex logic, freeing up time to focus on design, user experience, and overall system architecture.

How AI Was Used:
User Story & Plan Generation: The project was planned collaboratively with an AI, defining user stories, a tech stack, and a step-by-step roadmap.

Code Generation: AI was prompted to generate core components and functions, including the drag-and-drop file uploader, the backend API route for transcription, and the API calls to the summarisation model.

Debugging: When errors occurred (e.g., ModuleNotFoundError), the AI was used to diagnose the issue and provide corrected code.

Prompt Engineering: The prompts for the summarization model were carefully engineered to ensure the output was in a precise, machine-readable JSON format, demonstrating an understanding of how to get predictable results from a generative model.

Tech Stack
Frontend: Next.js (with React) & Tailwind CSS

Backend: Python (Flask) & Google Colab (for a free, temporary server)

AI APIs: OpenAI Whisper (Transcription) & Google Gemini (Summarization)

Update API URL: Copy the new public URL from your Colab notebook and paste it into the API_URL constant in the Next.js Uploader.jsx component.

Run the App: npm run dev
