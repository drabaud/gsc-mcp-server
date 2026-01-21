import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { GSCService } from '../gscService.js';
import { siteUrlSchema, sitemapSchema } from './schemas.js';

interface Context {
  gscService: GSCService;
}

function jsonResult(data: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function registerSitemapsTools(server: McpServer, ctx: Context) {
  // List sitemaps
  server.tool(
    'list_sitemaps',
    'List all sitemaps submitted for a site in Google Search Console.',
    {
      siteUrl: siteUrlSchema,
    },
    async (args) => {
      const result = await ctx.gscService.listSitemaps(args.siteUrl);
      return jsonResult({
        sitemaps: (result.sitemap || []).map((sitemap) => ({
          path: sitemap.path,
          type: sitemap.type,
          lastSubmitted: sitemap.lastSubmitted,
          lastDownloaded: sitemap.lastDownloaded,
          isPending: sitemap.isPending,
          isSitemapsIndex: sitemap.isSitemapsIndex,
          warnings: sitemap.warnings,
          errors: sitemap.errors,
          contents: sitemap.contents,
        })),
      });
    }
  );

  // Get sitemap details
  server.tool(
    'get_sitemap',
    'Get details for a specific sitemap, including indexing status and any errors.',
    sitemapSchema,
    async (args) => {
      const result = await ctx.gscService.getSitemap(args.siteUrl, args.feedpath);
      return jsonResult({
        path: result.path,
        type: result.type,
        lastSubmitted: result.lastSubmitted,
        lastDownloaded: result.lastDownloaded,
        isPending: result.isPending,
        isSitemapsIndex: result.isSitemapsIndex,
        warnings: result.warnings,
        errors: result.errors,
        contents: result.contents,
      });
    }
  );

  // Submit sitemap
  server.tool(
    'submit_sitemap',
    'Submit a new sitemap to Google Search Console for indexing.',
    sitemapSchema,
    async (args) => {
      await ctx.gscService.submitSitemap(args.siteUrl, args.feedpath);
      return jsonResult({
        success: true,
        message: `Sitemap ${args.feedpath} submitted successfully for ${args.siteUrl}`,
      });
    }
  );

  // Delete sitemap
  server.tool(
    'delete_sitemap',
    'Delete a sitemap from Google Search Console.',
    sitemapSchema,
    async (args) => {
      await ctx.gscService.deleteSitemap(args.siteUrl, args.feedpath);
      return jsonResult({
        success: true,
        message: `Sitemap ${args.feedpath} deleted successfully from ${args.siteUrl}`,
      });
    }
  );
}
