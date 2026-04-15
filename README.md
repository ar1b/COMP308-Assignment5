# COMP308 Lab 5 — Tech Industry Sustainability Analyzer

## Group Members
1. Arib Kamal
2. Arsalaan Siddiqui
3. Ashwath Sharma
4. Sahil Gupta

## Project Overview
This application uses the Google Gemini AI API (gemini-2.5-flash) to generate 
summaries and analyses of environmental sustainability initiatives by leading 
tech companies including Microsoft, Amazon, Google, and Meta.

## Tech Stack
- Backend: Node.js + Express
- AI API: Google Gemini 2.5 Flash
- Frontend: React + Vite + React Bootstrap

## How to Run

### Prerequisites
- Node.js v18+
- A Google Gemini API key from https://aistudio.google.com/app/apikey

### Step 1 — Start the server
```bash
cd server
npm install
npm run dev
```
Server runs at http://localhost:5001

### Step 2 — Start the React UI
```bash
cd client
npm install
npm run dev
```
UI runs at http://localhost:3000

### Step 3 — Use the app
1. Open http://localhost:3000 in your browser
2. Click the **📊 Full Analysis** tab
3. Click **🤖 Generate Full Analysis with Gemini** to generate a 
   comprehensive AI analysis of all four companies
4. Click **🏢 By Company** to analyze individual companies
5. Click **✏️ Custom Article** to paste any article and get an AI summary

## How the Summarizer Works
1. Article content for Microsoft, Amazon, Google, and Meta is stored 
   in the Express server
2. When the user clicks Analyze, the server sends the article text to 
   the Gemini API along with a structured prompt asking for:
   - A concise summary
   - Key sustainability initiatives
   - Environmental impact assessment
   - Future goals and commitments
3. Gemini returns a structured analysis which is displayed in the React UI
4. For custom articles, users paste any text and the same analysis pipeline runs

## Article Selection Process
Articles were selected based on:
- Official sustainability pages from top tech companies
- Relevance to environmental impact and carbon reduction goals
- Recency — all sources reflect 2024-2025 commitments and progress reports

## Testing
- Tested Full Analysis endpoint: POST /api/summarize-all
- Tested individual company endpoint: POST /api/summarize
- Tested custom article input with pasted article text
- Verified Gemini responses are structured and relevant
- Tested error handling for invalid API keys and rate limits

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/summarize | Analyze a single article |
| POST | /api/summarize-all | Analyze all four companies |
| GET | /api/articles | Get all stored articles |