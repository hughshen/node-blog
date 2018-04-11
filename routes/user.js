var express = require('express');
var md5 = require('md5');
var User = require('../models/user');

var router = express.Router();

router.get('/login', (req, res, next) => {
    res.render('user/login');
});

router.post('/login', (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        req.session.message = 'All fields cant not be blank.';
        res.redirect('/user/login');
        return;
    }

    let model = new User();
    model.login(email, md5(password)).then(rows => {
        if (rows.length) {
            req.session.user = rows[0];
            res.redirect('/');
        } else {
            req.session.message = 'Incorrect email or password.';
            res.redirect('/user/login');
        }
    });
});

router.post('/logout', (req, res, next) => {
    req.session.user = null;
    res.redirect('/');
});

router.get('/signup', (req, res, next) => {
    res.render('user/signup');
});

router.post('/signup', (req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    if (!username || !email || !password) {
        req.session.message = 'All fields cant not be blank.';
        res.redirect('/user/signup');
        return;
    }

    let model = new User();
    model.getUserByEmail(email).then(rows => {
        if (rows.length) {
            return 'exists';
        } else {
            return model.signup(username, email, md5(password));
        }
    }).then(result => {
        if (result === 'exists') {
            req.session.message = `Email "${email}" already exists.`;
        } else if (result.insertId) {
            res.redirect('/user/login');
        } else {
            req.session.message = 'Signup failed.';
        }

        res.redirect('/user/signup');
    });
});

module.exports = router;
