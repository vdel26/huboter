var express  = require('express'),
    mongoose = require('mongoose'),
    extend   = require('underscore').extend,
    debug    = require('debug')('route:bots');

/* routes with basePath: /bots */
var bots = express.Router();

/* Model */
var Bot = mongoose.model('Bot');


/* INDEX – GET /bots - get all bots */
function index (req, res) {
  var userid = req.user._id;

  debug('req.user:' + req.user);

  Bot.find({ owner: userid }, function (err, results) {

    res.format({
      json: function () {
        res.json({ bots: results, error: err ? err.message : "" });
      },
      html: function () {
        res.render('bots/index', { bots: results, error: err ? err.message : "" });
      }
    });

  });
}


/* SHOW – GET /bots/:id - show a bot */
function show (req, res) {
  Bot.findOne({ _id: req.params.id }, function (err, result) {

    res.format({
      json: function () {
        res.json({ bot: result });
      },
      html: function () {
        res.render('bots/show', { bot: result });
      }
    });

  });
}


/* NEW – GET /bots/new - return page to create a bot */
function newBot (req, res) {
  res.render('bots/new');
}


/* CREATE – POST /bots - create a bot */
function create (req, res) {
  var userid = req.user._id;

  var bot = new Bot({
    name: req.body.name,
    adapter: req.body.adapter,
    config: req.body.config,
    owner: userid
  });

  debug('newbot: ' + bot);

  bot.createAndDeploy(function (err, newbot) {
    if (!err && newbot) debug('created bot with name %s', newbot.name);

    res.format({
      json: function () {
        if (!err) return res.send(200);
        res.send(400, { error: err.message });
      },
      html: function () {
        if (!err) return res.redirect('/'+ userid + '/bots');
        res.render('bots/new', { error: err.message });
      }
    });

  });
}


/*  DESTROY – DELETE /bots/:id - delete a bot */
function destroy (req, res) {
  var userid = req.user._id;

  Bot.findOne({ _id: req.params.id }, function (err, result) {
    result.destroy(function (err, destroyedBot) {
      if (err) return res.send('500', err);
      res.redirect('/'+ userid + '/bots');
    });
  });
}


/*  EDIT – GET /bots/:id/edit - get page to update info for a bot */
function edit (req, res) {
  Bot.findOne({_id: req.params.id}, function (err, result) {
    if (err) return console.log('ERROR');
    res.render('bots/edit', { bot: result });
  });
}


/*  UPDATE – PUT /bots/:id - update info for a bot */
function update (req, res) {
  var userid = req.user._id;

  Bot.findOne({_id: req.params.id}, function (err, result) {
    var bot = extend(result, req.body);

    bot.save(function (err) {

      res.format({
        json: function () {
          if (!err) return res.send(200);
          res.send(400, { error: err.message });
        },
        html: function () {
          if (!err) return res.redirect('/'+ userid + '/bots');
          res.render('bots/edit', { error: err.message });
        }
      });
    });

  });
}



/**
 * Mapping routes to actions
 */

bots.get('/', index);
bots.post('/', create);
bots.get('/new', newBot);
bots.get('/:id', show);
bots.delete('/:id', destroy);
bots.get('/:id/edit', edit);
bots.put('/:id', update);

module.exports = bots;
