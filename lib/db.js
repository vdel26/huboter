// mock database collections

var bots = exports.bots = [];

bots.push({ name: 'testbot', adapter: 'slack', id: 0 });
bots.push({ name: 'botdylan', adapter: 'irc', id: 1 });
bots.push({ name: 'robot', adapter: 'hipchat', id: 2 });

var users = exports.users = [];

users.push({ name: 'Victor', bots: [bots[0], bots[1]], id: 0  });
users.push({ name: 'Quim', bots: [bots[2]], id: 1 });