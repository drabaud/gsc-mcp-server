import { google, searchconsole_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface SearchAnalyticsQuery {
  siteUrl: string;
  startDate: string;
  endDate: string;
  dimensions?: ('query' | 'page' | 'country' | 'device' | 'searchAppearance')[];
  dimensionFilterGroups?: searchconsole_v1.Schema$ApiDimensionFilterGroup[];
  rowLimit?: number;
  startRow?: number;
  dataState?: 'all' | 'final';
}

export interface SearchAnalyticsRow {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
}

export class GSCService {
  private oauth2Client: OAuth2Client;
  private searchConsole: searchconsole_v1.Searchconsole;

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error(
        'Missing Google OAuth2 credentials. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN environment variables.'
      );
    }

    this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    this.oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    this.searchConsole = google.searchconsole({
      version: 'v1',
      auth: this.oauth2Client,
    });
  }

  // ==================== SITES ====================

  async listSites(): Promise<searchconsole_v1.Schema$SitesListResponse> {
    const response = await this.searchConsole.sites.list();
    return response.data;
  }

  async getSite(siteUrl: string): Promise<searchconsole_v1.Schema$WmxSite> {
    const response = await this.searchConsole.sites.get({
      siteUrl,
    });
    return response.data;
  }

  // ==================== SEARCH ANALYTICS ====================

  async querySearchAnalytics(
    query: SearchAnalyticsQuery
  ): Promise<searchconsole_v1.Schema$SearchAnalyticsQueryResponse> {
    const response = await this.searchConsole.searchanalytics.query({
      siteUrl: query.siteUrl,
      requestBody: {
        startDate: query.startDate,
        endDate: query.endDate,
        dimensions: query.dimensions,
        dimensionFilterGroups: query.dimensionFilterGroups,
        rowLimit: query.rowLimit || 1000,
        startRow: query.startRow || 0,
        dataState: query.dataState || 'all',
      },
    });
    return response.data;
  }

  async getTopQueries(
    siteUrl: string,
    startDate: string,
    endDate: string,
    limit: number = 25
  ): Promise<SearchAnalyticsRow[]> {
    const response = await this.querySearchAnalytics({
      siteUrl,
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: limit,
    });
    return (response.rows as SearchAnalyticsRow[]) || [];
  }

  async getTopPages(
    siteUrl: string,
    startDate: string,
    endDate: string,
    limit: number = 25
  ): Promise<SearchAnalyticsRow[]> {
    const response = await this.querySearchAnalytics({
      siteUrl,
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: limit,
    });
    return (response.rows as SearchAnalyticsRow[]) || [];
  }

  // ==================== SITEMAPS ====================

  async listSitemaps(
    siteUrl: string
  ): Promise<searchconsole_v1.Schema$SitemapsListResponse> {
    const response = await this.searchConsole.sitemaps.list({
      siteUrl,
    });
    return response.data;
  }

  async getSitemap(
    siteUrl: string,
    feedpath: string
  ): Promise<searchconsole_v1.Schema$WmxSitemap> {
    const response = await this.searchConsole.sitemaps.get({
      siteUrl,
      feedpath,
    });
    return response.data;
  }

  async submitSitemap(siteUrl: string, feedpath: string): Promise<void> {
    await this.searchConsole.sitemaps.submit({
      siteUrl,
      feedpath,
    });
  }

  async deleteSitemap(siteUrl: string, feedpath: string): Promise<void> {
    await this.searchConsole.sitemaps.delete({
      siteUrl,
      feedpath,
    });
  }

  // ==================== URL INSPECTION ====================

  async inspectUrl(
    siteUrl: string,
    inspectionUrl: string
  ): Promise<searchconsole_v1.Schema$InspectUrlIndexResponse> {
    const response = await this.searchConsole.urlInspection.index.inspect({
      requestBody: {
        siteUrl,
        inspectionUrl,
      },
    });
    return response.data;
  }
}
