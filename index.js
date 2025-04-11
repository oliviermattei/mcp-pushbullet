#!/usr/bin/env node

const https = require('https');

// Parse command line arguments
const argv = process.argv.slice(2);
let accessToken = null;

// Find the access token from arguments
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--access-token' && i + 1 < argv.length) {
    accessToken = argv[i + 1];
    break;
  }
}

if (!accessToken) {
  console.error('Error: Access token is required');
  process.exit(1);
}

// Set up the MCP server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 9876; // Choose a port

app.use(bodyParser.json());

// Endpoint to send notifications
app.post('/notify', async (req, res) => {
  try {
    const { title, message, status = 'success' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const notificationTitle = title || 'Cursor Notification';
    const result = await sendPushbulletNotification(notificationTitle, message, status);
    
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(port, () => {
  console.log(`MCP Pushbullet running on port ${port}`);
});

// Send notification to Pushbullet
function sendPushbulletNotification(title, message, status = 'success') {
  return new Promise((resolve, reject) => {
    // Prepare the request data
    const data = JSON.stringify({
      type: 'note',
      title: title,
      body: `${status.toUpperCase()}: ${message}`
    });

    // Prepare the request options
    const options = {
      hostname: 'api.pushbullet.com',
      path: '/v2/pushes',
      method: 'POST',
      headers: {
        'Access-Token': accessToken,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    // Make the request
    const req = https.request(options, (res) => {
      let responseBody = '';
      
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`Notification sent successfully: ${message}`);
          resolve(responseBody);
        } else {
          console.error(`Failed to send notification: ${res.statusCode} - ${responseBody}`);
          reject(new Error(`HTTP error ${res.statusCode}: ${responseBody}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`Error sending notification: ${error.message}`);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}