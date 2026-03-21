const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: `
## API REST pour gérer un Blog Simple

Cette API permet la gestion complète des articles d'un blog :
- **CRUD complet** : Créer, lire, modifier, supprimer des articles
- **Recherche** : Par titre, contenu, catégorie, auteur ou date
- **Validation** : Des entrées utilisateurs sur tous les endpoints

### Codes HTTP utilisés
- \`200\` OK
- \`201\` Créé avec succès
- \`400\` Requête mal formée
- \`404\` Ressource non trouvée
- \`500\` Erreur serveur interne
      `,
      contact: {
        name: 'Blog API Support',
        email: 'support@blog-api.dev'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement local'
      }
    ],
    tags: [
      {
        name: 'Articles',
        description: 'Gestion des articles du blog'
      }
    ],
    components: {
      schemas: {
        Article: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-123', description: 'Identifiant unique' },
            titre: { type: 'string', example: 'Introduction au Web', description: 'Titre de l\'article' },
            contenu: { type: 'string', example: 'Le développement web...', description: 'Contenu complet de l\'article' },
            auteur: { type: 'string', example: 'Charles', description: 'Nom de l\'auteur' },
            date: { type: 'string', format: 'date', example: '2026-03-10', description: 'Date de publication (YYYY-MM-DD)' },
            categorie: { type: 'string', example: 'Technologie', description: 'Catégorie de l\'article' },
            tags: { type: 'array', items: { type: 'string' }, example: ['web', 'html', 'css'], description: 'Liste de tags' },
            created_at: { type: 'string', description: 'Date de création en base' },
            updated_at: { type: 'string', description: 'Date de dernière modification' }
          }
        },
        ArticleInput: {
          type: 'object',
          required: ['titre', 'contenu', 'auteur', 'date', 'categorie'],
          properties: {
            titre: { type: 'string', example: 'Mon nouvel article' },
            contenu: { type: 'string', example: 'Contenu de l\'article...' },
            auteur: { type: 'string', example: 'Alice' },
            date: { type: 'string', format: 'date', example: '2026-03-21' },
            categorie: { type: 'string', example: 'Tech' },
            tags: { type: 'array', items: { type: 'string' }, example: ['tech', 'tutorial'] }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'array', items: { type: 'object' } }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);
