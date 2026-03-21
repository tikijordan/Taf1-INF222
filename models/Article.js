const { getDb } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class ArticleModel {
  // Créer un article
  static create({ titre, contenu, auteur, categorie, tags = [] }) {
    const db = getDb();
    const id = uuidv4();
    const date = new Date().toISOString().split('T')[0];
    const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : [tags]);

    const stmt = db.prepare(`
      INSERT INTO articles (id, titre, contenu, auteur, date, categorie, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, titre, contenu, auteur, date, categorie, tagsJson);

    return this.findById(id);
  }

  // Lire tous les articles avec filtres
  static findAll({ categorie, auteur, date, page = 1, limit = 10 } = {}) {
    const db = getDb();
    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    if (categorie) {
      query += ' AND categorie = ?';
      params.push(categorie);
    }
    if (auteur) {
      query += ' AND auteur LIKE ?';
      params.push(`%${auteur}%`);
    }
    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }

    query += ' ORDER BY created_at DESC';
    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), (Number(page) - 1) * Number(limit));

    const articles = db.prepare(query).all(...params);
    return articles.map(this._parse);
  }

  // Trouver un article par ID
  static findById(id) {
    const db = getDb();
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    if (!article) return null;
    return this._parse(article);
  }

  // Modifier un article
  static update(id, { titre, contenu, auteur, categorie, tags }) {
    const db = getDb();
    const existing = this.findById(id);
    if (!existing) return null;

    const updated = {
      titre: titre ?? existing.titre,
      contenu: contenu ?? existing.contenu,
      auteur: auteur ?? existing.auteur,
      categorie: categorie ?? existing.categorie,
      tags: JSON.stringify(tags ?? existing.tags),
    };

    db.prepare(`
      UPDATE articles
      SET titre = ?, contenu = ?, auteur = ?, categorie = ?, tags = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(updated.titre, updated.contenu, updated.auteur, updated.categorie, updated.tags, id);

    return this.findById(id);
  }

  // Supprimer un article
  static delete(id) {
    const db = getDb();
    const existing = this.findById(id);
    if (!existing) return false;
    db.prepare('DELETE FROM articles WHERE id = ?').run(id);
    return true;
  }

  // Rechercher dans titre et contenu
  static search(query) {
    const db = getDb();
    const articles = db.prepare(`
      SELECT * FROM articles
      WHERE titre LIKE ? OR contenu LIKE ?
      ORDER BY created_at DESC
    `).all(`%${query}%`, `%${query}%`);
    return articles.map(this._parse);
  }

  // Parser les tags JSON
  static _parse(article) {
    return {
      ...article,
      tags: (() => {
        try { return JSON.parse(article.tags); }
        catch { return []; }
      })()
    };
  }
}

module.exports = ArticleModel;
