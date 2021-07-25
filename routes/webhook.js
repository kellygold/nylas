const { query } = require('express');
var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    console.log(req.query)
    res.send(req.query.challenge)
});

module.exports = router;
