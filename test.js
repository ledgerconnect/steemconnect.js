var steemConnect = require('./lib/steemconnect');

var username = process.env.STEEM_USERNAME;
var password = process.env.STEEM_PASSWORD;

var privKeys = steemConnect.auth.getPrivateKeys(username, password, ['posting']);
console.log(privKeys);

var tx = {
	expiration: '2016-08-16T16:16:39',
	extensions: [],
	operations: [['vote', {
		voter: "kaptainkrayola",
		author: 'steemapp',
		permlink: 'introducing-steemy-fully-native-ios-android-apps-for-steem',
		weight: 10000
	}]],
	ref_block_num: 7713,
	ref_block_prefix: 3799131183,
	signatures: []
};

console.log(tx)

//2052021bf67f98b5b4d25015c7fc8a1b6d6fb9c94e766f1e12ea1c15c43e4c577e5383569325a6dc849a64aa473cafdab8ff30922cc5fa162643a4d13e15fd024c

var signedTransaction = steemConnect.auth.signTransaction(tx, privKeys);
console.log(signedTransaction);