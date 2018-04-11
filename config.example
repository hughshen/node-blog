var marked = require('marked');
var highlightjs = require('highlightjs');

module.exports = {
    DB: {
        host : 'localhost',
        user : 'root',
        password : '',
        database : 'web'
    },
    MarkedOptions: {
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        highlight: function (code) {
            return highlightjs.highlightAuto(code).value;
        }
    }
};
