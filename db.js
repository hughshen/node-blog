var mysql = require('mysql');
var ConfigDB = require('./config').DB;

var pool = mysql.createPool(ConfigDB);

class Database {
    constructor(config) {
        this.pool = pool;
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) reject(err);
                connection.query(sql, args, (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                    connection.release()
                });
            });
        });
    }
}

module.exports = Database;
