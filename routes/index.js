var express    = require('express'),
    hubotUtils = require('../lib/hubot');

var router = express.Router();

/* GET slack config details page */
function index (req, res) {
  res.render('index', { title: 'Huboter' });
}

/* GET /testrun – test endpoint that starts a bot */
function startbot (req, res) {
  hubotUtils.launch(function (code, output) {
    console.log(code);
  });
  res.send(200);
}

/**
 * Mapping routes to actions
 */
router.get('/', index);
router.get('/testrun', startbot);
// router.post('/', received);
// router.get('/isrunning', isrunning);

module.exports = router;