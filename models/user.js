var Base = require('./base');

class User extends Base {
    async login(email, password) {
        return await this.db.query('SELECT id, username, role FROM user WHERE email = ? AND password = ?', [email, password]);
    }

    async getUserByEmail(email) {
        return await this.db.query('SELECT id FROM user WHERE email = ?', [email]);
    }

    async signup(username, email, password) {
        return await this.db.query('INSERT INTO user(email, username, password, created_at, updated_at) VALUES(?, ?, ?, NOW(), NOW());', [email, username, password]);
    }
}

module.exports = User;
