var steemConnect = require('./lib/steemconnect'),
	steem = require('steem'),
	moment = require('moment');

var username = process.env.STEEM_USERNAME;
var password = process.env.STEEM_PASSWORD;

var tx = {
	extensions: [],
	operations: [['vote', {
		voter: username,
		author: 'mynameisbrian',
		permlink: 'uber-under-attack-my-first-hand-experience-with-uber-regulation',
		weight: 10000
	}]],
	signatures: []
};
var privKeys = steemConnect.auth.getPrivateKeys(username, password, ['posting']);

steem.api.login(username, password, function() {
	steem.api.getDynamicGlobalProperties(function(err, result) {
			tx.expiration = moment.utc(result.timestamp).add(15, 'second').format().replace('Z', '');
			tx.ref_block_num = result.head_block_number & 0xFFFF;
			tx.ref_block_prefix =  new Buffer(result.head_block_id, 'hex').readUInt32LE(4);
			var signedTransaction = steemConnect.auth.signTransaction(tx, privKeys);
			console.log(signedTransaction);
			steem.api.broadcastTransactionWithCallback(function(cb) {}, signedTransaction, function(err, result) {
				console.log(err, result);
			});
	});
});