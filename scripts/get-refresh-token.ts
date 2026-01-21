#!/usr/bin/env npx tsx

/**
 * Script to obtain a Google OAuth2 refresh token for Google Search Console API
 *
 * Prerequisites:
 * 1. Create a project in Google Cloud Console (https://console.cloud.google.com)
 * 2. Enable the "Search Console API"
 * 3. Create OAuth 2.0 credentials (Desktop application type)
 * 4. Download the credentials JSON and set the environment variables below
 *
 * Usage:
 * 1. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables
 * 2. Run: npx tsx scripts/get-refresh-token.ts
 * 3. Open the URL in your browser and authorize the application
 * 4. Copy the authorization code and paste it in the terminal
 * 5. The refresh token will be displayed
 */

import { google } from 'googleapis';
import * as readline from 'readline';

const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/webmasters',
];

async function getRefreshToken() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Error: Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables');
    console.error('\nExample:');
    console.error('  set GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com');
    console.error('  set GOOGLE_CLIENT_SECRET=your-secret');
    console.error('  npx tsx scripts/get-refresh-token.ts');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'urn:ietf:wg:oauth:2.0:oob' // Desktop app redirect URI
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Force consent to always get refresh token
  });

  console.log('\n=== Google Search Console OAuth Setup ===\n');
  console.log('1. Open this URL in your browser:\n');
  console.log(authUrl);
  console.log('\n2. Sign in with your Google account and authorize the application');
  console.log('3. Copy the authorization code and paste it below\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await new Promise<string>((resolve) => {
    rl.question('Enter the authorization code: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });

  try {
    const { tokens } = await oauth2Client.getToken(code);

    console.log('\n=== Success! ===\n');
    console.log('Add these values to your .mcp.json configuration:\n');
    console.log(`GOOGLE_CLIENT_ID: ${clientId}`);
    console.log(`GOOGLE_CLIENT_SECRET: ${clientSecret}`);
    console.log(`GOOGLE_REFRESH_TOKEN: ${tokens.refresh_token}`);

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

  } catch (error) {
    console.error('\nError exchanging authorization code:', error);
    process.exit(1);
  }
}

getRefreshToken();
