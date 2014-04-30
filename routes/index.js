var express    = require('express'),
    hubotUtils = require('../lib/hubot');

var router = express.Router();

/* GET slack config details page */
function index (req, res) {
  res.render('index', { title: 'Huboter' });
}

/* GET /testrun – test endpoint that starts a bot */
function startbot (req, res) {
  hubotUtils.prepareEnv();
  hubotUtils.launch(function (data) {
    console.log(data);
  });
  res.send(200);
}

/* GET /stoprun – test endpoint that stops a bot */
function stopbot (req, res) {
  hubotUtils.stop(function (data) {
    console.log(data);
  });
  res.send(200);
}

/**
 * Mapping routes to actions
 */
router.get('/', index);
router.get('/testrun', startbot);
router.get('/teststop', stopbot);

module.exports = router;