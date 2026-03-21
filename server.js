const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const articleRoutes = require('./routes/articles');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir le frontend statique
app.use(express.static(path.join(__dirname, 'public')));

// ── Swagger Configuration ────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '📝 Blog API',
      version: '1.0.0',
      description: `
## API REST pour la gestion d'un blog

### Fonctionnalités
- ✅ CRUD complet sur les articles
- 🔍 Recherche par titre et contenu
- 📂 Filtrage par catégorie, auteur, date
- 📖 Pagination des résultats

### Codes HTTP utilisés
| Code | Signification |
|------|---------------|
| 200  | OK |
| 201  | Créé avec succès |
| 400  | Requête mal formée |
| 404  | Ressource non trouvée |
| 500  | Erreur serveur |
      `,
      contact: {
        name: 'Blog API Support',
      },
    },
    servers: [
      { url: `http://localhost:${PORT}`, description: 'Serveur local' },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { background-color: #1a1a2e; }',
  customSiteTitle: 'Blog API - Documentation',
}));

// ── Routes ───────────────────────────────────────────────────
app.use('/api/articles', articleRoutes);

// Route racine - redirige vers le frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 pour les routes API inconnues
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route API non trouvée' });
});

// ── Démarrage ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Blog API démarré sur http://localhost:${PORT}`);
  console.log(`📚 Documentation Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`🌐 Interface web: http://localhost:${PORT}\n`);
});

module.exports = app;
