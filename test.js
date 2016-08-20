var steemConnect = require('./lib/steemconnect');

var username = process.env.STEEM_USERNAME;
var password = process.env.STEEM_PASSWORD;

var privKeys = steemConnect.auth.getPrivateKeys(username, password, ['posting']);
console.log(privKeys);

var tx = {
	expiration: '2016-08-20T02:59:51',
	extensions: [],
	operations: [['vote', {
		voter: username,
		author: 'rogerkver',
		permlink: 'roger-ver-the-world-s-first-bitcoin-investor-is-now-on-steemit',
		weight: 10000
	}]],
	ref_block_num: 40607,
	ref_block_prefix: 2394871259,
	signatures: []
};

var signedTransaction = steemConnect.auth.signTransaction(tx, privKeys);
console.log(signedTransaction);

if (signedTransaction.signatures[0] == '206239640514a1aac6ef29b0fdf7bf1f1457526a77bb4cb35bc82d7f614d271bb54783850b6da824db5cf787d7a7b9b8a1da5fd3d2c2ebf53437906fc93f45d238') {
	console.log('The signature is correct!');
}