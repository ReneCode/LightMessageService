var express = require('express');
var passport = require('passport');
var Account = require('../models/account')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LightMessageService', user: req.user });
});


router.get('/register', (req, res) => {
  res.render('register', {})
});

router.post('/register', (req, res) => {
  Account.register( 
      new Account({username: req.body.username }),
      req.body.password,
      (err, account) => {
        if (err) {
          return res.render('register', { account, accout });
        } 
        passport.authenticate('local')(req, res, () => {
          res.redirect('/')
        })
      }
  )
});

router.get('/login', (req, res) => {
  res.render('login', {user: req.user})
});

router.post('/login', passport.authenticate('local'), (req, res)  => {
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


router.get('/ping', (req, res) => {

  res.status(200).send("pong");
});



module.exports = router;
