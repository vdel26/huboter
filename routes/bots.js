var express  = require('express'),
    mongoose = require('mongoose');

/* routes with basePath: /bots */
var bots = express.Router();

/* Model */
var Bot = mongoose.model('Bot');


/* INDEX – GET /bots - get all bots */
function index (req, res) {
  Bot.find({}, function (err, results) {
    if (err) console.log('ERROR'); // use logger

    res.format({
      json: function () {
        res.json({ bots: results });
      },
      html: function () {
        res.render('bots/index', { bots: results });
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

/* CREATE – POST /bots/new - create a bot */
function create (req, res) {
  Bot.create({ name: req.body.name, adapter: req.body.adapter }, function (err, newbot) {
    if (err) res.send('500', err);
    res.redirect('/bots');
  });
}

/*  DESTROY – DELETE /bots/:id - delete a bot */
function destroy (req, res) {
  Bot.remove({ _id: req.params.id }, function (err) {
    if (err) res.send('500', err);
    res.redirect('/bots');
  });
}

/*  EDIT – GET /bots/:id/edit - get page to update info for a bot */
function edit (req, res) {
  Bot.findOne({_id: req.params.id}, function (err, result) {
    if (err) console.log('ERROR');
    res.render('bots/edit', { bot: result });
  });
}

/*  UPDATE – PUT /bots/:id - update info for a bot */
function update (req, res) {
  Bot.update({_id: req.params.id}, {name: req.body.name},
    function (err, docsAffected, raw) {
      if (err) console.log('ERROR');
      res.redirect('/bots');
    });
}

/* Middleware to preload Model instance if the path contains
* an id parameter 
* */
function load (req, res, next) {
  // TODO: abstract from show, destroy, edit and update
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
