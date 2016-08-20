var BigInteger = require('bigi');
var ecurve = require('ecurve');
var secp256k1 = ecurve.getCurveByName('secp256k1');
var base58 = require('bs58');
var hash = require('./hash');
var config = 'STM';
var assert = require('assert');

var G = secp256k1.G
var n = secp256k1.n

var PublicKey = function(Q){
    var self = this;
    self.Q = Q;

    self.fromBinary = function(bin) {
        return self.fromBuffer(new Buffer(bin, 'binary'));
    }

    self.fromBuffer = function(buffer) {
        return new self(ecurve.Point.decodeFrom(secp256k1, buffer));
    }

    self.toBuffer = function(compressed ) {
        if(!compressed) compressed = self.Q.compressed;
        return self.Q.getEncoded(compressed);
    }

    self.fromPoint = function(point) {
        return new PublicKey(point);
    }

    self.toUncompressed = function() {
        var buf = self.Q.getEncoded(false);
        var point = ecurve.Point.decodeFrom(secp256k1, buf);
        return self.fromPoint(point);
    }

    self.toBlockchainAddress = function() {
        var pub_buf = self.toBuffer();
        var pub_sha = hash.sha512(pub_buf);
        return hash.ripemd160(pub_sha);
    }

    self.toString = function(address_prefix) {
        if(!address_prefix) address_prefix = config.address_prefix
        return self.toPublicKeyString(address_prefix)
    }

    self.toPublicKeyString = function(address_prefix) {
         if(!address_prefix) address_prefix = config.address_prefix
        if(self.pubdata) return address_prefix + self.pubdata
        const pub_buf = self.toBuffer();
        const checksum = hash.ripemd160(pub_buf);
        const addy = Buffer.concat([pub_buf, checksum.slice(0, 4)]);
        self.pubdata = base58.encode(addy)
        return address_prefix + self.pubdata;
    }

    /**
        @arg {string} public_key - like STMXyz...
        @arg {string} address_prefix - like STM
        @throws {Error} if public key is invalid
        @return PublicKey
    */
    self.fromString = function(public_key, address_prefix) {
         if(!address_prefix) address_prefix = config.address_prefix
        try {
            return self.fromStringOrThrow(public_key, address_prefix)
        } catch (e) {
            return null;
        }
    }

    self.fromStringOrThrow = function(public_key, address_prefix ) {
         if(!address_prefix) address_prefix = config.address_prefix
        var prefix = public_key.slice(0, address_prefix.length);
        assert.equal(
            address_prefix, prefix,
            `Expecting key to begin with ${address_prefix}, instead got ${prefix}`);
            public_key = public_key.slice(address_prefix.length);

        public_key = new Buffer(base58.decode(public_key), 'binary');
        var checksum = public_key.slice(-4);
        public_key = public_key.slice(0, -4);
        var new_checksum = hash.ripemd160(public_key);
        new_checksum = new_checksum.slice(0, 4);
        assert.deepEqual(checksum, new_checksum, 'Checksum did not match');
        return self.fromBuffer(public_key);
    }

    self.toAddressString = function(address_prefix ) {
         if(!address_prefix) address_prefix = config.address_prefix
        var pub_buf = self.toBuffer();
        var pub_sha = hash.sha512(pub_buf);
        var addy = hash.ripemd160(pub_sha);
        var checksum = hash.ripemd160(addy);
        addy = Buffer.concat([addy, checksum.slice(0, 4)]);
        return address_prefix + base58.encode(addy);
    }

    self.toPtsAddy = function() {
        var pub_buf = self.toBuffer();
        var pub_sha = hash.sha256(pub_buf);
        var addy = hash.ripemd160(pub_sha);
        addy = Buffer.concat([new Buffer([0x38]), addy]); //version 56(decimal)

        var checksum = hash.sha256(addy);
        checksum = hash.sha256(checksum);

        addy = Buffer.concat([addy, checksum.slice(0, 4)]);
        return base58.encode(addy);
    }

    self.child = function( offset ) {

        assert(Buffer.isBuffer(offset), "Buffer required: offset")
        assert.equal(offset.length, 32, "offset length")

        offset = Buffer.concat([ self.toBuffer(), offset ])
        offset = hash.sha256( offset )

        var c = BigInteger.fromBuffer( offset )

        if (c.compareTo(n) >= 0)
            throw new Error("Child offset went out of bounds, try again")


        var cG = G.multiply(c)
        var Qprime = self.Q.add(cG)

        if( secp256k1.isInfinity(Qprime) )
            throw new Error("Child offset derived to an invalid key, try again")

        return self.fromPoint(Qprime)
    }

    /* <HEX> */

    self.toByteBuffer = function() {
        var b = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
        self.appendByteBuffer(b);
        return b.copy(0, b.offset);
    }

    self.fromHex = function(hex) {
        return self.fromBuffer(new Buffer(hex, 'hex'));
    }

    self.toHex = function() {
        return self.toBuffer().toString('hex');
    }

    self.fromStringHex = function(hex) {
        return self.fromString(new Buffer(hex, 'hex'));
    }

}

module.exports = PublicKey;
