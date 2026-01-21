#!/usr/bin/env npx tsx

/**
 * Script to obtain a Google OAuth2 refresh token for Google Search Console API
 *
 * Prerequisites:
 * 1. Create a project in Google Cloud Console (https://console.cloud.google.com)
 * 2. Enable the "Search Console API"
 * 3. Create OAuth 2.0 credentials (Web application type)
 * 4. Add http://localhost:3000/oauth/callback as authorized redirect URI
 * 5. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file
 *
 * Usage:
 * 1. Run: npm run get-token
 * 2. Open the URL in your browser and authorize the application
 * 3. You will be redirected and the refresh token will be displayed
 */

import { google } from 'googleapis';
import http from 'http';
import url from 'url';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/webmasters',
];

const REDIRECT_URI = 'http://localhost:9999/oauth/callback';

async function getRefreshToken() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Error: Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    REDIRECT_URI
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  console.log('\n=== Google Search Console OAuth Setup ===\n');
  console.log('Opening browser for authorization...\n');
  console.log('If the browser does not open, visit this URL manually:\n');
  console.log(authUrl);
  console.log('\n');

  // Create a local server to handle the callback
  const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url || '', true);

    if (parsedUrl.pathname === '/oauth/callback') {
      const code = parsedUrl.query.code as string;

      if (code) {
        try {
          const { tokens } = await oauth2Client.getToken(code);

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                <h1 style="color: green;">Success!</h1>
                <p>You can close this window and return to the terminal.</p>
              </body>
            </html>
          `);

          console.log('\n=== Success! ===\n');
          console.log('Add this GOOGLE_REFRESH_TOKEN to your .env file:\n');
          console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);

          console.log('\n--- .mcp.json snippet ---\n');
          console.log(JSON.stringify({
            "google-search-console": {
              command: "node",
              args: ["C:\\Users\\didie\\Desktop\\Dev\\gsc-mcp-server\\dist\\main.js"],
              env: {
                GOOGLE_CLIENT_ID: clientId,
                GOOGLE_CLIENT_SECRET: clientSecret,
                GOOGLE_REFRESH_TOKEN: tokens.refresh_token,
              }
            }
          }, null, 2));

          server.close();
          process.exit(0);
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                <h1 style="color: red;">Error</h1>
                <p>Failed to get refresh token. Check the terminal for details.</p>
              </body>
            </html>
          `);
          console.error('\nError exchanging authorization code:', error);
          server.close();
          process.exit(1);
        }
      } else {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
              <h1 style="color: red;">Error</h1>
              <p>No authorization code received.</p>
            </body>
          </html>
        `);
      }
    }
  });

  server.listen(9999, () => {
    console.log('Waiting for authorization...');
    console.log('Please open the URL above in your browser manually.');
  });
}

getRefreshToken();
