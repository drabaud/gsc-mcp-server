# Google Search Console MCP Server

Serveur MCP (Model Context Protocol) pour Google Search Console API.

## Outils disponibles

| Tool | Description |
|------|-------------|
| `list_sites` | Liste toutes les propriétés Search Console |
| `get_site` | Détails d'une propriété spécifique |
| `query_search_analytics` | Requête complète : clics, impressions, CTR, position |
| `get_top_queries` | Top requêtes de recherche |
| `get_top_pages` | Top pages par performance |
| `list_sitemaps` | Liste des sitemaps d'un site |
| `get_sitemap` | Détails d'un sitemap |
| `submit_sitemap` | Soumettre un nouveau sitemap |
| `delete_sitemap` | Supprimer un sitemap |
| `inspect_url` | Inspecter l'indexation d'une URL |

## Configuration

### 1. Créer un projet Google Cloud

1. Aller sur [Google Cloud Console](https://console.cloud.google.com)
2. Créer un nouveau projet ou en sélectionner un existant
3. Activer l'API **Search Console API** :
   - Menu → APIs & Services → Library
   - Rechercher "Search Console API"
   - Cliquer sur "Enable"

### 2. Créer des credentials OAuth2

1. Menu → APIs & Services → Credentials
2. Cliquer "Create Credentials" → "OAuth client ID"
3. Type d'application : **Desktop app**
4. Donner un nom (ex: "GSC MCP Server")
5. Noter le **Client ID** et **Client Secret**

### 3. Obtenir le Refresh Token

```bash
cd C:\Users\didie\Desktop\Dev\gsc-mcp-server

# Définir les variables d'environnement
set GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
set GOOGLE_CLIENT_SECRET=votre-secret

# Lancer le script
npm run get-token
```

Suivre les instructions pour autoriser l'application et récupérer le refresh token.

### 4. Configurer le MCP

Éditer `~/.mcp.json` et ajouter les credentials :

```json
{
  "mcpServers": {
    "google-search-console": {
      "command": "node",
      "args": ["C:\\Users\\didie\\Desktop\\Dev\\gsc-mcp-server\\dist\\main.js"],
      "env": {
        "GOOGLE_CLIENT_ID": "votre-client-id.apps.googleusercontent.com",
        "GOOGLE_CLIENT_SECRET": "votre-secret",
        "GOOGLE_REFRESH_TOKEN": "votre-refresh-token"
      }
    }
  }
}
```

## Exemples d'utilisation

### Lister les sites
```
"Liste mes sites Search Console"
```

### Analyser les performances
```
"Montre-moi les top 10 requêtes pour sc-domain:example.com des 30 derniers jours"
```

### Vérifier l'indexation
```
"Inspecte l'URL https://example.com/page pour voir si elle est indexée"
```

## Build

```bash
npm install
npm run build
```

## Test avec MCP Inspector

```bash
npx @modelcontextprotocol/inspector
```

Configurer avec : `node C:\Users\didie\Desktop\Dev\gsc-mcp-server\dist\main.js`
