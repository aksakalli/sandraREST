var express = require('express');
var router = express.Router();

/**
 * serve index file of client side html app
 */
router.get('/',  function(req, res) {
    res.sendfile('public/client-index.html');
})

module.exports = router;
