import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { GSCService } from './gscService.js';
import { registerAllTools } from './tools/index.js';

export interface ServerOptions {
  gscService: GSCService;
}

export function createServer(options: ServerOptions): McpServer {
  const server = new McpServer({
    name: 'google-search-console',
    version: '1.0.0',
  });

  const ctx = {
    gscService: options.gscService,
  };

  registerAllTools(server, ctx);

  return server;
}
