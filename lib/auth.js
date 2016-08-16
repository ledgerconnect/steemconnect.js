var bigi = require('bigi'),
	crypto = require('crypto'),
	bs58 = require('bs58'),
	ecurve = require('ecurve'),
	Point = ecurve.Point,
	secp256k1 = ecurve.getCurveByName('secp256k1');

var Auth = {};

Auth.verify = function(name, password, auths){
	var hasKey = false;
	var roles = [];
	for (var role in auths) {
		roles.push(role);
	}
	var pubKeys = this.test(name, password, roles);
	roles.forEach(function(role){
		if (auths[role][0][0] === pubKeys[role]){
			hasKey = true;
		}
	});
	return hasKey;
};

Auth.generateKeys = function(name, password, roles){
	var pubKeys = {};
	roles.forEach(function(role){
		var seed = name + role + password;
		var brainKey = seed.trim().split(/[\t\n\v\f\r ]+/).join(' ');
		var hashSha256 = crypto.createHash('sha256').update(brainKey).digest();
		var bigInt = bigi.fromBuffer(hashSha256);
		var toPubKey = secp256k1.G.multiply(bigInt);
		var point = new Point(toPubKey.curve, toPubKey.x, toPubKey.y, toPubKey.z);
		var pubBuf  = point.getEncoded(toPubKey.compressed);
		var checksum = crypto.createHash('rmd160').update(pubBuf).digest();
		var addy = Buffer.concat([pubBuf, checksum.slice(0, 4)]);
		pubKeys[role] = 'STM' + bs58.encode(addy);
	});
	return pubKeys;
};

Auth.getPrivateKeys = function(name, password, roles){
	var pubKeys = {};
	roles.forEach(function(role){
		var seed = name + role + password;
		var private_key = new Buffer(seed); // <- Something wrong here
		private_key = Buffer.concat([new Buffer([0x80]), private_key]);
		var checksum = crypto.createHash('sha256').update(private_key).digest();
		checksum = crypto.createHash('sha256').update(checksum).digest();
		checksum = checksum.slice(0, 4);
		var private_wif = Buffer.concat([private_key, checksum]);
		var priv = bs58.encode(private_wif);
		console.log(priv);
	});
	return pubKeys;
};


module.exports = Auth;