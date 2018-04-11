var Base = require('./base');

class Term extends Base {
    async getList(type) {
        return await this.db.query('SELECT title, slug, created_at FROM term WHERE status = 1 AND type = ? ORDER BY sorting ASC, created_at DESC', [type]);
    }

    async getTermBySlug(type, slug) {
        return await this.db.query('SELECT title, slug FROM term WHERE type = ? AND slug = ? AND status = 1', [type, slug]);
    }

    async getPostsBySlug(type, slug) {
        return await this.db.query('SELECT p.title, p.description, p.slug, p.created_at FROM post p LEFT JOIN relationship r ON p.id = r.post_id LEFT JOIN term t ON t.id = r.term_id WHERE p.status = "publish" AND t.status = 1 AND t.type = ? AND t.slug = ? ORDER BY p.sorting ASC, p.created_at DESC', [type, slug]);
    }

    async getPostsList(type, slug) {
        return await Promise.all([this.getTermBySlug(type, slug), this.getPostsBySlug(type, slug)]);
    }
}

module.exports = Term;
