# GSC MCP Server - Context

## Projet
MCP Server pour Google Search Console API permettant à Claude d'accéder aux données SEO.

## Configuration terminée
- API Google Search Console activée dans Google Cloud Console
- OAuth2 configuré (Application Web)
- Identifiants créés et stockés dans `.env`
- Refresh token obtenu et configuré
- Build effectué (`npm run build`)
- Fichier `.mcp.json` créé pour Claude Code

## Fichiers importants
- `.env` : Contient GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
- `.mcp.json` : Configuration MCP pour Claude Code
- `dist/main.js` : Point d'entrée compilé du serveur MCP

## Outils MCP disponibles
- `list_sites` - Lister les sites vérifiés dans GSC
- `get_site` - Obtenir les détails d'un site
- `query_search_analytics` - Requêtes de recherche (clics, impressions, CTR, position)
- `get_top_queries` - Top requêtes pour un site
- `get_top_pages` - Top pages pour un site
- `list_sitemaps` - Lister les sitemaps d'un site
- `get_sitemap` - Détails d'un sitemap
- `submit_sitemap` - Soumettre un sitemap
- `delete_sitemap` - Supprimer un sitemap
- `inspect_url` - Inspecter l'indexation d'une URL

## Prochaines étapes
Après reload de VS Code, tester le MCP avec : "Liste mes sites Google Search Console"

## Notes
- Norton Antivirus bloque les commandes PowerShell depuis Claude Code
- Utiliser CMD externe si besoin d'exécuter des commandes
