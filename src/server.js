const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const articleRoutes = require('./routes/article.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares de sécurité et parsing ──────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // désactivé pour Swagger UI
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Fichiers statiques (frontend) ───────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../public')));

// ── Documentation Swagger ───────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: `
    .swagger-ui .topbar { background-color: #0f172a; }
    .swagger-ui .topbar-wrapper img { content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30"><text y="22" font-size="20" fill="white" font-family="serif">📝 Blog API</text></svg>'); }
  `,
  customSiteTitle: 'Blog API - Documentation'
}));

// ── Routes API ──────────────────────────────────────────────────────────────
app.use('/api/articles', articleRoutes);

// ── Route racine ─────────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    name: 'Blog API',
    version: '1.0.0',
    description: 'API REST pour gérer un blog simple',
    endpoints: {
      articles: '/api/articles',
      search: '/api/articles/search?query=...',
      docs: '/api-docs',
      frontend: '/'
    }
  });
});

// ── Fallback SPA ─────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  } else {
    res.status(404).json({ error: 'Route non trouvée' });
  }
});

// ── Gestion globale des erreurs ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err);
  res.status(500).json({ error: 'Erreur interne du serveur', details: err.message });
});

// ── Démarrage du serveur ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Blog API démarré !`);
  console.log(`   → API:           http://localhost:${PORT}/api`);
  console.log(`   → Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`   → Frontend:      http://localhost:${PORT}`);
  console.log(`\nAppuyez sur Ctrl+C pour arrêter.\n`);
});

module.exports = app;
