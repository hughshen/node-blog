var Base = require('./base');

class Post extends Base {
    async getIndexList() {
        return await this.db.query('SELECT title, description, slug, created_at FROM post WHERE status = "publish" ORDER BY sorting ASC, created_at DESC');
    }

    async getSearchList(s) {
        return await this.db.query('SELECT title, description, slug, created_at FROM post WHERE status = "publish" AND (title LIKE ? OR content LIKE ?) ORDER BY sorting ASC, created_at DESC', [`%${s}%`, `%${s}%`]);
    }

    async getPostBySlug(slug) {
        return await this.db.query('SELECT p.id, p.title, p.content, p.created_at, u.username FROM post p LEFT JOIN user u ON p.author = u.id WHERE p.status = "publish" AND p.slug = ?', [slug]);
    }

    async getTermsById(id) {
        return await this.db.query('SELECT t.title, t.slug, t.type FROM term t LEFT JOIN relationship r ON t.id = r.term_id WHERE t.status = 1 AND r.post_id = ? ORDER BY sorting ASC, created_at DESC', [id]);
    }
}

module.exports = Post;
