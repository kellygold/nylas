var express = require('express');
var router = express.Router();

const Nylas = require('nylas');

Nylas.config({ clientId: '90m8dh2ue1rmjp2hvlja8rypf', clientSecret: '5y6iwa9cyx19w6t6r1jywolne'});
options = {
  loginHint: 'you_email@example.com',
  redirectURI: 'http://localhost:3000/callback',
  scopes: ['email.read_only', 'email.send','email.folders_and_labels'],
};
auth_url = Nylas.urlForAuthentication(options);

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { data: {title: 'Nylas Homework App', authUrl: auth_url }});
});

module.exports = router;
