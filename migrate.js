var _ = require('lodash');
var md5 = require('md5');
var faker = require('faker');
var Database = require('./db');

let userTable = 
    `CREATE TABLE if NOT EXISTS user (
    id int(11) NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    role varchar(16) NOT NULL DEFAULT 'user',
    status tinyint(1) NOT NULL DEFAULT '1',
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;

let postTable =
    `CREATE TABLE if NOT EXISTS post (
    id int(11) NOT NULL AUTO_INCREMENT,
    author int(11) NOT NULL DEFAULT '0',
    title varchar(255) NOT NULL,
    content text,
    description text,
    slug varchar(255) NOT NULL,
    sorting int(11) NOT NULL DEFAULT '0',
    status varchar(255) NOT NULL DEFAULT 'publish',
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;

let termTable = 
    `CREATE TABLE if NOT EXISTS term (
    id int(11) NOT NULL AUTO_INCREMENT,
    parent int(11) NOT NULL DEFAULT '0',
    type varchar(32) NOT NULL DEFAULT 'category',
    title varchar(255) NOT NULL,
    description text,
    slug varchar(255) NOT NULL,
    sorting int(11) NOT NULL DEFAULT '0',
    status tinyint(1) NOT NULL DEFAULT '1',
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;

let relationshipTable = 
    `CREATE TABLE if NOT EXISTS relationship (
    id int(11) NOT NULL AUTO_INCREMENT,
    post_id int(11) NOT NULL,
    term_id int(11) NOT NULL,
    PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;

let db = new Database();

console.log('Create user table...');
db.query(userTable).then(() => {
    console.log('Create user table done!');
    // Add admin user
    db.query('INSERT INTO user(email, username, password, role, created_at, updated_at) VALUES("admin@admin.com", "admin", ?, "admin", NOW(), NOW());', [md5('admin')]);
    for (let i = 1; i <= 5; i++) {
        console.log(`Insert faker user data (${i})`);
        db.query('INSERT INTO user(email, username, password, created_at, updated_at) VALUES(?, ?, ?, NOW(), NOW());', [
            faker.internet.email(),
            faker.name.findName(),
            md5('123456')
        ]);
    }
});

console.log('Create post table...');
db.query(postTable).then(() => {
    console.log('Create post table done!');
    for (let i = 1; i <= 15; i++) {
        console.log(`Insert faker post data (${i})`);
        db.query('INSERT INTO post(author, title, content, description, slug, created_at, updated_at) VALUES(?, ?, ?, ?, ?, NOW(), NOW());', [
            faker.random.arrayElement(_.range(1, 6)),
            faker.lorem.words(),
            faker.lorem.paragraphs(),
            faker.lorem.paragraph(),
            faker.lorem.slug()
        ]);
    }
});

console.log('Create term table...');
db.query(termTable).then(() => {
    console.log('Create term table done!');
    for (let i = 1; i <= 15; i++) {
        console.log(`Insert faker term data (${i})`);
        db.query('INSERT INTO term(title, description, slug, type, created_at, updated_at) VALUES(?, ?, ?, ?, NOW(), NOW());', [
            faker.lorem.words(),
            faker.lorem.paragraph(),
            faker.lorem.slug(),
            faker.random.arrayElement(['category', 'tag'])
        ]);
    }
});

console.log('Create relationship table...');
db.query(relationshipTable).then(() => {
    console.log('Create relationship table done!');
    for (let i = 1; i <= 30; i++) {
        console.log(`Insert faker relationship data (${i})`);
        db.query('INSERT INTO relationship(post_id, term_id) VALUES(?, ?);', [
            faker.random.arrayElement(_.range(1, 15)),
            faker.random.arrayElement(_.range(1, 15))
        ]);
    }
});
