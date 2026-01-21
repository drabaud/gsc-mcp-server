import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { GSCService } from '../gscService.js';
import { registerSearchAnalyticsTools } from './search-analytics.js';
import { registerSitesTools } from './sites.js';
import { registerSitemapsTools } from './sitemaps.js';
import { registerUrlInspectionTools } from './url-inspection.js';

interface Context {
  gscService: GSCService;
}

export function registerAllTools(server: McpServer, ctx: Context) {
  registerSitesTools(server, ctx);
  registerSearchAnalyticsTools(server, ctx);
  registerSitemapsTools(server, ctx);
  registerUrlInspectionTools(server, ctx);
}
