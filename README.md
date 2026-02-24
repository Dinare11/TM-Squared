# Cybersecurity Insights Dashboard

## Features
- Matrix background animation
- Real-time cybersecurity threat updates via WebSocket
- Filtering by severity: Critical, Medium, Safe
- Responsive design

## Setup
1. Install Node.js
2. Install dependencies:
   ```
   npm install ws node-fetch
   ```
3. Replace `YOUR_API_KEY_HERE` in `server.js` with your AlienVault OTX API key.
4. Start the WebSocket server:
   ```
   node server.js
   ```
5. Open `index.html` in a browser (modern browser recommended).

## Notes
- The WebSocket server pushes threat updates every 60 seconds.
- You can deploy both frontend and backend to a cloud server for production use.