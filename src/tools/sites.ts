import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { GSCService } from '../gscService.js';
import { siteUrlSchema } from './schemas.js';

interface Context {
  gscService: GSCService;
}

function jsonResult(data: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function registerSitesTools(server: McpServer, ctx: Context) {
  // List all sites
  server.tool(
    'list_sites',
    'List all sites (properties) that the user has access to in Google Search Console. Returns site URLs and permission levels.',
    {},
    async () => {
      const result = await ctx.gscService.listSites();
      return jsonResult({
        sites: (result.siteEntry || []).map((site) => ({
          siteUrl: site.siteUrl,
          permissionLevel: site.permissionLevel,
        })),
      });
    }
  );

  // Get site details
  server.tool(
    'get_site',
    'Get details for a specific site in Google Search Console, including permission level.',
    {
      siteUrl: siteUrlSchema,
    },
    async (args) => {
      const result = await ctx.gscService.getSite(args.siteUrl);
      return jsonResult({
        siteUrl: result.siteUrl,
        permissionLevel: result.permissionLevel,
      });
    }
  );
}
