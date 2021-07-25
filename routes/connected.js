var express = require('express');
var router = express.Router();
const request = require('request')

const Nylas = require('nylas');
const app = require('../app');
Nylas.config({ clientId: '90m8dh2ue1rmjp2hvlja8rypf', clientSecret: '5y6iwa9cyx19w6t6r1jywolne'});
options = {
  loginHint: 'you_email@example.com',
  redirectURI: 'http://localhost:3000/callback',
  scopes: ['email.read_only', 'email.send','email.folders_and_labels','email.modify'],
};
auth_url = Nylas.urlForAuthentication(options);

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('connected', { data: {title: 'Success!', authUrl: auth_url, token: app.locals.access_token }});
});

router.get('/createlabel', function(req, res, next){
    var nylas = Nylas.with(app.locals.access_token)
    label = nylas.labels.build();
    label.displayName = 'nylas_challenges4'
    label.save();
    nylas.labels.list().then(labels => {
        //console.log(JSON.stringify(labels[0]))
        console.log(labels)
        for (let i = 0; i < labels.length; i++){
            if (labels[i].displayName == "nylas_challenges2"){
                app.locals.labelId = labels[i].id
                console.log(app.locals.labelId)
            }
        }
    });
    res.render('createlabel', { data: {title: 'Success!', authUrl: auth_url, token: app.locals.access_token }});
})

router.get('/labelcreated', function(req, res, next){
    var nylas = Nylas.with(app.locals.access_token)

})

router.get('/sendemail', function(req, res, next){
    var nylas = Nylas.with(app.locals.access_token)
    const draft = nylas.drafts.build({
        subject: 'With Love, from Nylas',
        body: 'This email was sent using the Nylas email API. Visit https://nylas.com for details.',
        to: [{ name: 'My Nylas Friend', email: 'kgoldfishspam@gmail.com' }]
    });   
    draft.send().then(message => {
    console.log(`${message.id} was sent`);
    app.locals.messageId = message.id
    res.render('sendemail', { data: {title: 'Success!', authUrl: auth_url, token: app.locals.access_token }});
});

router.get('/findemail', function(req, res, next){
    var nylas = Nylas.with(app.locals.access_token)
    nylas.messages.list({to: 'kgoldfishspam@gmail.com', limit: 1}).then(resp => {
        //console.log(JSON.stringify(resp[0].id))
        app.locals.messageId = resp[0].id
        console.log(resp[0])
        //console.log(app.locals.messageId)
        res.redirect('/connected/foundEmail')
    });
    console.log(app.locals.messageId)
    // Get a single message, by its id

    // res.render('sendemail', { data: {title: 'Success!', authUrl: auth_url, token: app.locals.access_token, messageId: app.locals.messageId }});
})
})

router.get('/foundemail', function(req, res, next){
    var nylas = Nylas.with(app.locals.access_token)
    console.log("asdfasdf")
    console.log(app.locals.messageId + " -----messageid")
    console.log(app.locals.labelId + " -----labelId")
    var messageURL = "https://api.nylas.com/messages/"+app.locals.messageId
    var body = JSON.stringify({"label_ids":[`${app.locals.labelId}`, "6nbsxqpvwbgl8sdh963zwe92x"]})
    //console.log(body)
    request.put({
        headers: {'accept' : 'application/json', 'Authorization' : app.locals.access_token},
        url: messageURL,
        body: body
      }, function(error, response, body){
        console.log(response.body)
      });
      res.render('updateemail', { data: {title: 'Success!', authUrl: auth_url, token: app.locals.access_token, messageId: app.locals.messageId }});
});

module.exports = router;
