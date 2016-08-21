console.log('address');

var assert = require('assert');
var config = 'STM';
var hash = require('./hash');
var base58 = require('bs58');

/** Addresses are shortened non-reversable hashes of a public key.  The full PublicKey is preferred.
    @deprecated
*/
var Address = function(addy) {

     this.addy = addy;
     var self = this;


    self.fromBuffer = function(buffer) {
        var _hash = hash.sha512(buffer);
        var addy = hash.ripemd160(_hash);
        return new Address(addy);
    }

    self.fromString= function(string, address_prefix ) {
        if(!address_prefix) address_prefix = config.address_prefix;
        var prefix = string.slice(0, address_prefix.length);
        assert.equal(address_prefix, prefix, `Expecting key to begin with ${address_prefix}, instead got ${prefix}`);
        var addy = string.slice(address_prefix.length);
        addy = new Buffer(base58.decode(addy), 'binary');
        var checksum = addy.slice(-4);
        addy = addy.slice(0, -4);
        var new_checksum = hash.ripemd160(addy);
        new_checksum = new_checksum.slice(0, 4);
        assert.deepEqual(checksum, new_checksum, 'Checksum did not match');
        return new Address(addy);
    }

    /** @return Address - Compressed PTS format (by default) */
    self.fromPublic= function(public_key, compressed , version) {

        var sha2 = hash.sha256(public_key.toBuffer(compressed));
        var rep = hash.ripemd160(sha2);
        var versionBuffer = new Buffer(1);
        versionBuffer.writeUInt8((0xFF & version), 0);
        var addr = Buffer.concat([versionBuffer, rep]);
        var check = hash.sha256(addr);
        check = hash.sha256(check);
        var buffer = Buffer.concat([addr, check.slice(0, 4)]);
        return new Address(hash.ripemd160(buffer));
    }

    self.toBuffer = function() {
        return self.addy;
    }

    self.toString = function(address_prefix ) {
        if(!address_prefix) address_prefix = config.address_prefix;
        var checksum = hash.ripemd160(this.addy);
        var addy = Buffer.concat([this.addy, checksum.slice(0, 4)]);
        return address_prefix + base58.encode(addy);
    }
}

module.exports = Address;
