import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { GSCService } from '../gscService.js';
import {
  searchAnalyticsQuerySchema,
  topQueriesSchema,
  topPagesSchema,
} from './schemas.js';

interface Context {
  gscService: GSCService;
}

function jsonResult(data: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function registerSearchAnalyticsTools(server: McpServer, ctx: Context) {
  // Query Search Analytics - Main tool
  server.tool(
    'query_search_analytics',
    'Query Google Search Console search analytics data. Returns clicks, impressions, CTR, and position metrics grouped by specified dimensions.',
    searchAnalyticsQuerySchema,
    async (args) => {
      const result = await ctx.gscService.querySearchAnalytics({
        siteUrl: args.siteUrl,
        startDate: args.startDate,
        endDate: args.endDate,
        dimensions: args.dimensions as any,
        rowLimit: args.rowLimit,
        startRow: args.startRow,
        dataState: args.dataState as any,
      });
      return jsonResult({
        rows: result.rows || [],
        responseAggregationType: result.responseAggregationType,
      });
    }
  );

  // Get Top Queries
  server.tool(
    'get_top_queries',
    'Get the top search queries for a site. Returns queries ranked by clicks with impressions, CTR, and average position.',
    topQueriesSchema,
    async (args) => {
      const rows = await ctx.gscService.getTopQueries(
        args.siteUrl,
        args.startDate,
        args.endDate,
        args.limit
      );
      return jsonResult({
        queries: rows.map((row) => ({
          query: row.keys?.[0],
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: row.ctr ? (row.ctr * 100).toFixed(2) + '%' : undefined,
          position: row.position?.toFixed(1),
        })),
      });
    }
  );

  // Get Top Pages
  server.tool(
    'get_top_pages',
    'Get the top performing pages for a site. Returns pages ranked by clicks with impressions, CTR, and average position.',
    topPagesSchema,
    async (args) => {
      const rows = await ctx.gscService.getTopPages(
        args.siteUrl,
        args.startDate,
        args.endDate,
        args.limit
      );
      return jsonResult({
        pages: rows.map((row) => ({
          page: row.keys?.[0],
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: row.ctr ? (row.ctr * 100).toFixed(2) + '%' : undefined,
          position: row.position?.toFixed(1),
        })),
      });
    }
  );
}
