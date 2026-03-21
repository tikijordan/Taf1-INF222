const { getDb } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class ArticleModel {
  /**
   * Récupère tous les articles avec filtres optionnels
   */
  static getAll({ categorie, auteur, date } = {}) {
    const db = getDb();
    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    if (categorie) {
      query += ' AND LOWER(categorie) = LOWER(?)';
      params.push(categorie);
    }
    if (auteur) {
      query += ' AND LOWER(auteur) = LOWER(?)';
      params.push(auteur);
    }
    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const rows = db.prepare(query).all(...params);
    return rows.map(this._parseArticle);
  }

  /**
   * Récupère un article par son ID
   */
  static getById(id) {
    const db = getDb();
    const row = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    return row ? this._parseArticle(row) : null;
  }

  /**
   * Crée un nouvel article
   */
  static create({ titre, contenu, auteur, date, categorie, tags = [] }) {
    const db = getDb();
    const id = uuidv4();
    const tagsJson = JSON.stringify(tags);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO articles (id, titre, contenu, auteur, date, categorie, tags, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, titre, contenu, auteur, date, categorie, tagsJson, now, now);

    return this.getById(id);
  }

  /**
   * Met à jour un article existant
   */
  static update(id, { titre, contenu, auteur, date, categorie, tags }) {
    const db = getDb();
    const existing = this.getById(id);
    if (!existing) return null;

    const updated = {
      titre: titre ?? existing.titre,
      contenu: contenu ?? existing.contenu,
      auteur: auteur ?? existing.auteur,
      date: date ?? existing.date,
      categorie: categorie ?? existing.categorie,
      tags: tags ?? existing.tags
    };

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE articles
      SET titre = ?, contenu = ?, auteur = ?, date = ?, categorie = ?, tags = ?, updated_at = ?
      WHERE id = ?
    `).run(
      updated.titre,
      updated.contenu,
      updated.auteur,
      updated.date,
      updated.categorie,
      JSON.stringify(updated.tags),
      now,
      id
    );

    return this.getById(id);
  }

  /**
   * Supprime un article par son ID
   */
  static delete(id) {
    const db = getDb();
    const existing = this.getById(id);
    if (!existing) return null;
    db.prepare('DELETE FROM articles WHERE id = ?').run(id);
    return existing;
  }

  /**
   * Recherche dans le titre et le contenu
   */
  static search(query) {
    const db = getDb();
    const term = `%${query}%`;
    const rows = db.prepare(`
      SELECT * FROM articles
      WHERE titre LIKE ? OR contenu LIKE ?
      ORDER BY date DESC
    `).all(term, term);
    return rows.map(this._parseArticle);
  }

  /**
   * Parse un article depuis la DB (convertit les tags JSON)
   */
  static _parseArticle(row) {
    return {
      ...row,
      tags: (() => {
        try { return JSON.parse(row.tags); } catch { return []; }
      })()
    };
  }
}

module.exports = ArticleModel;
