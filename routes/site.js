var express = require('express');
var marked = require('marked');
var MarkedOptions = require('../config').MarkedOptions;
var Post = require('../models/post');
var Term = require('../models/term');

var router = express.Router();

marked.setOptions(MarkedOptions);

router.get('/', (req, res, next) => {
    let model = new Post();
    model.getIndexList().then(list => {
        res.locals.list = list;
        res.render('site/index');
    });
});

router.get('/post/:slug', (req, res, next) => {
    let model = new Post();
    let post = {};
    let terms = {};
    model.getPostBySlug(req.params.slug).then(rows => {
        if (rows.length) {
            post = rows[0];
            post.content = marked(post.content);
            return model.getTermsById(post.id);
        } else {
            return null;
        }
    }).then(data => {
        if (data !== null) {
            for (key in data) {
                let val = data[key];
                if (!(val.type in terms)) {
                    terms[val.type] = [];
                }
                terms[val.type].push(val);
            }
            res.locals.post = post;
            res.locals.terms = terms;
            res.render('site/post');
        } else {
            next();
        }
    });
});

router.get('/search', (req, res, next) => {
    let s = req.query.s;
    if (s.length) {
        let model = new Post();
        model.getSearchList(s).then(list => {
            res.locals.heading = `Search: ${s}`;
            res.locals.list = list;
            res.render('site/index');
        });
    } else {
        res.redirect('/');
    }
});

router.get('/categories', (req, res, next) => {
    let model = new Term;
    model.getList('category').then(list => {
        res.render('site/categories', {list: list});
    });
});

router.get('/category/:slug', (req, res, next) => {
    let model = new Term;
    model.getPostsList('category', req.params.slug).then(data => {
        if (data[0].length) {
            res.locals.heading = `Category: ${data[0][0].title}`;
            res.locals.list = data[1];
            res.render('site/index');
        } else {
            next();
        }
    });
});

router.get('/tags', (req, res, next) => {
    let model = new Term;
    model.getList('tag').then(list => {
        res.render('site/tags', {list: list});
    });
});

router.get('/tag/:slug', (req, res, next) => {
    let model = new Term;
    model.getPostsList('tag', req.params.slug).then(data => {
        if (data[0].length) {
            res.locals.heading = `Tag: ${data[0][0].title}`;
            res.locals.list = data[1];
            res.render('site/index');
        } else {
            next();
        }
    });
});

module.exports = router;
