var express = require('express');
var router = express.Router();
const Nylas = require('nylas');
const app = require('../app');
const request = require('request')

/* GET home page. */
app.locals = {}


var exchangeCodeForToken = function(req, res, next) {
    // Nylas.config({ clientId: '90m8dh2ue1rmjp2hvlja8rypf', clientSecret: '5y6iwa9cyx19w6t6r1jywolne'});
    code = req.query.code
    // let access_token
    // Nylas.exchangeCodeForToken(code).then(resp => {
    //   app.locals.access_token = resp
    //   console.log(app.locals.access_token)
    // });
    stringBody = JSON.stringify({
      client_id: '90m8dh2ue1rmjp2hvlja8rypf',
      client_secret: '5y6iwa9cyx19w6t6r1jywolne',
      grant_type: 'authorization_code',
      code: code
    })
    request.post({
      headers: {'accept' : 'application/json', 'Authorization' : 'Basic NXk2aXdhOWN5eDE5dzZ0NnIxanl3b2xuZQ=='},
      url: 'https://api.nylas.com/oauth/token',
      body: stringBody
    }, function(error, response, body){
      body = JSON.parse(response.body)
      app.locals.access_token = body.access_token
      res.redirect('/connected')
    });
};

router.get('/', [exchangeCodeForToken]);
module.exports = router;
