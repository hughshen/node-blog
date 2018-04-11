var Database = require('../db');

class Base {
    constructor(config) {
        this.db = new Database();
    }
}

module.exports = Base;
