var express = require('express');
var Edit = require('../models/edit');

var router = express.Router();

var termsMiddleware = (req, res, next) => {
    let model = new Edit();
    let terms = {};
    model.getTermsList().then(list => {
        for (key in list) {
            let val = list[key];
            if (!(val.type in terms)) {
                terms[val.type] = [];
            }
            terms[val.type].push(val);
        }
        res.locals.terms = terms;
        next();
    });
};

router.get('/posts', (req, res, next) => {
    let user = req.session.user;
    let model = new Edit();
    model.getPostsListByUserId(user.id).then(list => {
        res.locals.list = list;
        res.render('edit/posts');
    });
});

router.get('/new-post', termsMiddleware, (req, res, next) => {
    res.locals.post = {};
    res.locals.relationship = [];
    res.render('edit/post-form');
});

router.get('/update-post/:id', termsMiddleware, (req, res, next) => {
    let user = req.session.user;
    let model = new Edit();

    model.getUserSinglePostDataById(req.params.id, user.id).then(result => {
        if (result[0].length) {
            res.locals.post = result[0][0];
            res.locals.relationship = [];
            if (result[1].length) {
                result[1].forEach(v => {
                    res.locals.relationship.push(v.id);
                });
            }
            res.render('edit/post-form');
        } else {
            next();
        }
    });
});

router.post('/update-post', (req, res, next) => {
    let user = req.session.user;

    let id = req.body.id;
    let title = req.body.title;
    let content = req.body.content;
    let description = req.body.description;
    let slug = req.body.slug;
    let terms = req.body.terms;

    if (!title || !content || !description || !slug) {
        req.session.message = 'All fields cant not be blank.';
        res.redirect(`/edit/update-post/${id}`);
        return;
    }

    let model = new Edit();

    if (id) {
        let check = async () => {
            return await Promise.all([model.getPostBySlugExcludeId(slug, id), model.getUserSinglePostById(id, user.id)]);
        };

        check().then(result => {
            if (result[0].length == 0 && result[1].length) {
                model.updatePost(id, title, content, description, slug).then(result => {
                    if (result.affectedRows) {
                        model.deleteRelationship(id).then(result => {
                            if (terms.length) {
                                model.addRelationship(id, terms);
                            }
                        });
                        res.redirect('/edit/posts');
                    } else {
                        req.session.message = 'Update post failed.';
                        res.redirect(`/edit/update-post/${id}`);
                    }
                });
            } else {
                if (result[0].length) {
                    req.session.message = `Slug "${slug}" already exists.`;
                } else {
                    req.session.message = 'Update post failed.';
                }
                res.redirect(`/edit/update-post/${id}`);
            }
        });
    } else {
        model.getPostBySlug(slug).then(rows => {
            if (rows.length) {
                return 'exists';
            } else {
                return model.addNewPost(user.id, title, content, description, slug);
            }
        }).then(result => {
            if (result === 'exists') {
                req.session.message = `Slug "${slug}" already exists.`;
            } else if (result.insertId) {
                if (terms.length) {
                    model.addRelationship(result.insertId, terms);
                }
                res.redirect('/edit/posts');
            } else {
                req.session.message = 'Add new post failed.';
            }

            res.redirect('/edit/new-post');
        });
    }
});

router.get('/terms', (req, res, next) => {
    let model = new Edit();
    model.getTermsList().then(list => {
        res.locals.list = list;
        res.render('edit/terms');
    });
});

router.get('/new-term', (req, res, next) => {
    res.locals.term = {};
    res.render('edit/term-form');
});

router.get('/update-term/:id', (req, res, next) => {
    let model = new Edit();
    model.getSingleTermById(req.params.id).then(rows => {
        if (rows.length) {
            res.locals.term = rows[0];
            res.render('edit/term-form');
        } else {
            next();
        }
    });
});

router.post('/update-term', (req, res, next) => {
    let id = req.body.id;
    let type = req.body.type;
    let title = req.body.title;
    let description = req.body.description;
    let slug = req.body.slug;
    let status = req.body.status;

    if (!type || !title || !slug || !status) {
        req.session.message = 'All fields cant not be blank.';
        res.redirect(`/edit/update-term/${id}`);
        return;
    }

    let model = new Edit();

    if (id) {
        let check = async () => {
            return await Promise.all([model.getSingleTermById(id), model.getTermBySlugExcludeId(slug, id)]);
        };

        check().then(result => {
            if (result[0].length && result[1].length == 0) {
                model.updateTerm(id, type, title, description, slug, status).then(result => {
                    if (result.affectedRows) {
                        res.redirect('/edit/terms');
                    } else {
                        req.session.message = 'Update term failed.';
                        res.redirect(`/edit/update-term/${id}`);
                    }
                });
            } else {
                if (result[1].length) {
                    req.session.message = `Slug "${slug}" already exists.`;
                } else {
                    req.session.message = 'Update term failed.';
                }
                res.redirect(`/edit/update-term/${id}`);
            }
        });
    } else {
        model.getTermBySlug(slug).then(rows => {
            if (rows.length) {
                return 'exists';
            } else {
                return model.addNewTerm(type, title, description, slug, status);
            }
        }).then(result => {
            if (result === 'exists') {
                req.session.message = `Slug "${slug}" already exists.`;
            } else if (result.insertId) {
                res.redirect('/edit/terms');
            } else {
                req.session.message = 'Add new term failed.';
            }

            res.redirect('/edit/new-term');
        });
    }
});

module.exports = router;
