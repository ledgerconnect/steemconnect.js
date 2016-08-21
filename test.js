var steemConnect = require('./lib/steemconnect'),
	steem = require('steem'),
	moment = require('moment');

var username = process.env.STEEM_USERNAME;
var password = process.env.STEEM_PASSWORD;

var privKeys = steemConnect.auth.getPrivateKeys(username, password, ['posting']);
console.log(privKeys);

steem.api.getContent('rogerkver', 'roger-ver-the-world-s-first-bitcoin-investor-is-now-on-steemit', function(err, result) {
	//console.log(err, result);
});

var tx = {
	//expiration: '2016-08-20T02:59:51',
	extensions: [],
	operations: [['vote', {
		voter: username,
		author: 'mynameisbrian',
		permlink: 'the-evolution-and-diversity-of-the-steemit-whale-past-present-and-future',
		weight: 10000
	}]],
	//ref_block_num: 40607, // next block
	//ref_block_prefix: 2394871259,
	signatures: []
};

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

//console.log(new Buffer('004123ee28007e0a8820ba419329705e051c3f7a', 'hex').readUInt32LE(4));

/*
var signedTransaction = steemConnect.auth.signTransaction(tx, privKeys);

if (signedTransaction.signatures[0] == '206239640514a1aac6ef29b0fdf7bf1f1457526a77bb4cb35bc82d7f614d271bb54783850b6da824db5cf787d7a7b9b8a1da5fd3d2c2ebf53437906fc93f45d238') {
	console.log('The signature is correct!');
}
*/

