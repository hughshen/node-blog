var Base = require('./base');

class Edit extends Base {
    async getPostsListByUserId(uid) {
        return await this.db.query('SELECT id, title, content, description, slug FROM post WHERE author = ? AND status = "publish" ORDER BY sorting ASC, created_at DESC', [uid]);
    }

    async getPostBySlug(slug) {
        return await this.db.query('SELECT id, title, slug FROM post WHERE slug = ?', [slug]);
    }

    async getPostBySlugExcludeId(slug, id) {
        return await this.db.query('SELECT id, title, slug FROM post WHERE slug = ? AND id != ?', [slug, id]);
    }

    async getUserSinglePostById(pid, uid) {
        return await this.db.query('SELECT id, title, content, description, slug FROM post WHERE id = ? AND author = ?', [pid, uid]);
    }

    async getPostTermsById(id) {
        return await this.db.query('SELECT term_id AS id FROM relationship WHERE post_id = ?', [id]);
    }

    async getUserSinglePostDataById(pid, uid) {
        return await Promise.all([this.getUserSinglePostById(pid, uid), this.getPostTermsById(pid)]);
    }

    async addNewPost(author, title, content, description, slug) {
        return await this.db.query('INSERT INTO post(author, title, content, description, slug, created_at, updated_at) VALUES(?, ?, ?, ?, ?, NOW(), NOW())', [author, title, content, description, slug]);
    }

    async updatePost(id, title, content, description, slug) {
        return await this.db.query('UPDATE post SET title = ?, content = ?, description = ?, slug = ?, updated_at = NOW() WHERE id = ?', [title, content, description, slug, id]);
    }

    async deleteRelationship(id) {
        return await this.db.query('DELETE FROM relationship WHERE post_id = ?', [id]);
    }

    async addRelationship(id, list) {
        let values = [];
        list.forEach(v => {
            values.push(`("${id}", "${v}")`);
        });
        return await this.db.query('INSERT INTO relationship(post_id, term_id) VALUES ' + values.join(', '));
    }

    async getTermsList() {
        return await this.db.query('SELECT id, type, title, description, slug, status FROM term ORDER BY FIELD(type, "category", "tag"), sorting ASC, created_at DESC');
    }

    async getTermBySlug(slug) {
        return await this.db.query('SELECT id, title, slug FROM term WHERE slug = ?', [slug]);
    }

    async getTermBySlugExcludeId(slug, id) {
        return await this.db.query('SELECT id, title, slug FROM term WHERE slug = ? AND id != ?', [slug, id]);
    }

    async addNewTerm(type, title, description, slug, status) {
        return await this.db.query('INSERT INTO term(type, title, description, slug, status, created_at, updated_at) VALUES(?, ?, ?, ?, ?, NOW(), NOW())', [type, title, description, slug, status]);
    }

    async getSingleTermById(id) {
        return await this.db.query('SELECT id, type, title, description, slug, status FROM term WHERE id = ?', [id]);
    }

    async updateTerm(id, type, title, description, slug, status) {
        return await this.db.query('UPDATE term SET type = ?, title = ?, description = ?, slug = ?, status = ?, updated_at = NOW() WHERE id = ?', [type, title, description, slug, status, id]);
    }
}

module.exports = Edit;
