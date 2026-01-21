import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { GSCService } from '../gscService.js';
import { urlInspectionSchema } from './schemas.js';

interface Context {
  gscService: GSCService;
}

function jsonResult(data: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function registerUrlInspectionTools(server: McpServer, ctx: Context) {
  // Inspect URL
  server.tool(
    'inspect_url',
    'Inspect a URL to get indexing information from Google Search Console. Returns coverage state, indexing status, crawl info, and mobile usability.',
    urlInspectionSchema,
    async (args) => {
      const result = await ctx.gscService.inspectUrl(args.siteUrl, args.inspectionUrl);

      const inspection = result.inspectionResult;

      return jsonResult({
        inspectionUrl: args.inspectionUrl,
        indexStatusResult: inspection?.indexStatusResult
          ? {
              verdict: inspection.indexStatusResult.verdict,
              coverageState: inspection.indexStatusResult.coverageState,
              robotsTxtState: inspection.indexStatusResult.robotsTxtState,
              indexingState: inspection.indexStatusResult.indexingState,
              lastCrawlTime: inspection.indexStatusResult.lastCrawlTime,
              pageFetchState: inspection.indexStatusResult.pageFetchState,
              googleCanonical: inspection.indexStatusResult.googleCanonical,
              userCanonical: inspection.indexStatusResult.userCanonical,
              crawledAs: inspection.indexStatusResult.crawledAs,
              referringUrls: inspection.indexStatusResult.referringUrls,
            }
          : null,
        mobileUsabilityResult: inspection?.mobileUsabilityResult
          ? {
              verdict: inspection.mobileUsabilityResult.verdict,
              issues: inspection.mobileUsabilityResult.issues,
            }
          : null,
        richResultsResult: inspection?.richResultsResult
          ? {
              verdict: inspection.richResultsResult.verdict,
              detectedItems: inspection.richResultsResult.detectedItems,
            }
          : null,
        ampResult: inspection?.ampResult
          ? {
              verdict: inspection.ampResult.verdict,
              ampUrl: inspection.ampResult.ampUrl,
              ampIndexStatusVerdict: inspection.ampResult.ampIndexStatusVerdict,
              issues: inspection.ampResult.issues,
            }
          : null,
      });
    }
  );
}
