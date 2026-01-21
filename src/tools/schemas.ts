import { z } from 'zod';

// Common schemas
export const siteUrlSchema = z
  .string()
  .describe(
    'The site URL as registered in Search Console. Can be a domain property (sc-domain:example.com) or a URL prefix (https://example.com/)'
  );

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .describe('Date in YYYY-MM-DD format');

// Dimension schemas
export const dimensionSchema = z
  .enum(['query', 'page', 'country', 'device', 'searchAppearance'])
  .describe('Dimension to group results by');

export const dimensionsArraySchema = z
  .array(dimensionSchema)
  .optional()
  .describe('Array of dimensions to group results by');

// Filter schemas
export const dimensionFilterOperatorSchema = z
  .enum(['equals', 'notEquals', 'contains', 'notContains', 'includingRegex', 'excludingRegex'])
  .describe('Filter operator');

export const dimensionFilterSchema = z.object({
  dimension: dimensionSchema,
  operator: dimensionFilterOperatorSchema,
  expression: z.string().describe('Filter value'),
});

export const dimensionFilterGroupSchema = z.object({
  groupType: z.enum(['and']).optional().default('and'),
  filters: z.array(dimensionFilterSchema).optional(),
});

// Search Analytics schemas
export const searchAnalyticsQuerySchema = {
  siteUrl: siteUrlSchema,
  startDate: dateSchema.describe('Start date for the query period'),
  endDate: dateSchema.describe('End date for the query period'),
  dimensions: dimensionsArraySchema,
  dimensionFilterGroups: z
    .array(dimensionFilterGroupSchema)
    .optional()
    .describe('Filters to apply to the query'),
  rowLimit: z
    .number()
    .min(1)
    .max(25000)
    .optional()
    .default(1000)
    .describe('Maximum number of rows to return (1-25000)'),
  startRow: z
    .number()
    .min(0)
    .optional()
    .default(0)
    .describe('Zero-based index of the first row to return'),
  dataState: z
    .enum(['all', 'final'])
    .optional()
    .default('all')
    .describe('Data state: all includes fresh data, final only verified data'),
};

// Top queries/pages schemas
export const topQueriesSchema = {
  siteUrl: siteUrlSchema,
  startDate: dateSchema,
  endDate: dateSchema,
  limit: z
    .number()
    .min(1)
    .max(25000)
    .optional()
    .default(25)
    .describe('Number of top queries to return'),
};

export const topPagesSchema = {
  siteUrl: siteUrlSchema,
  startDate: dateSchema,
  endDate: dateSchema,
  limit: z
    .number()
    .min(1)
    .max(25000)
    .optional()
    .default(25)
    .describe('Number of top pages to return'),
};

// Sitemap schemas
export const sitemapSchema = {
  siteUrl: siteUrlSchema,
  feedpath: z.string().describe('URL of the sitemap (e.g., https://example.com/sitemap.xml)'),
};

// URL Inspection schemas
export const urlInspectionSchema = {
  siteUrl: siteUrlSchema,
  inspectionUrl: z.string().url().describe('The fully-qualified URL to inspect'),
};

// Output schemas
export const searchAnalyticsRowSchema = z.object({
  keys: z.array(z.string()).optional(),
  clicks: z.number().optional(),
  impressions: z.number().optional(),
  ctr: z.number().optional(),
  position: z.number().optional(),
});

export const siteSchema = z.object({
  siteUrl: z.string().optional(),
  permissionLevel: z.string().optional(),
});

export const sitesListSchema = z.object({
  siteEntry: z.array(siteSchema).optional(),
});
