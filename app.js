var path = require('path');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var siteRouter = require('./routes/site');
var userRouter = require('./routes/user');
var editRouter = require('./routes/edit');

var app = express();

// body-parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Session
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'secret_key',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Setting
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use((req, res, next) => {
    res.locals.query = req.query;
    res.locals.url = req.originalUrl;
    next();
});

// If login
app.use((req, res, next) => {
    res.locals.user = req.session.user;

    if (req.session.user) {
        if (/^\/user\/(login|signup)/g.test(req.originalUrl)) {
            return res.redirect('/');
        }
    } else {
        if (/^\/edit/g.test(req.originalUrl)) {
            return res.redirect('/');
        }
    }

    next();
});

// Alert message
app.use((req, res, next) => {
    if (req.session.message) {
        res.locals.message = req.session.message;
        req.session.message = null;
    }
    next();
});

app.use('/', siteRouter);
app.use('/user', userRouter);
app.use('/edit', editRouter);

app.get('*', (req, res) => {
    res.status(404).render('error', {title: 'Not Found (#404)'});
});

app.listen(3000, () => console.log('Web app listening on port 3000!'));
