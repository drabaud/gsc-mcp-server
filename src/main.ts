#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './index.js';
import { GSCService } from './gscService.js';

async function main() {
  try {
    // Initialize the Google Search Console service
    const gscService = new GSCService();

    // Create the MCP server
    const server = createServer({ gscService });

    // Create stdio transport
    const transport = new StdioServerTransport();

    // Connect the server to the transport
    await server.connect(transport);

    // Log to stderr (stdout is reserved for MCP protocol)
    console.error('Google Search Console MCP Server started');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
