var express = require('express'),
    Bot     = require('../lib/hubot');

var router = express.Router();

/* GET slack config details page */
function index (req, res) {
  res.render('index', { title: 'Huboter' });
}

/* POST show confirmation page */
function received (req, res) {
  var myBot = new Bot();
  myBot.launch();
  res.render('received', { data: req.body });
}

/* GET check if bot is running to update 'received' page */
function isrunning (req, res) {
  res.json(200, {running: false});
}

/**
 * Mapping routes to actions
 */
router.get('/', index);
router.post('/', received);
router.get('/isrunning', isrunning);

module.exports = router;