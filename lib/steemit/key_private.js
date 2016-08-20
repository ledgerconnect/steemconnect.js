var ecurve = require('ecurve');
var Point = ecurve.Point;
var secp256k1 = ecurve.getCurveByName('secp256k1');
var BigInteger = require('bigi');
var base58 = require('bs58');
var assert = require('assert');
var hash = require('./hash');
var publicKey = require('./key_public');
var PublicKey = new publicKey(0)

var G = secp256k1.G
var n = secp256k1.n

var PrivateKey = function(d) {
    this.d = d;
    /**
        @private see static functions
        @param {BigInteger}
    */
    var self = this;

    self.fromBuffer = function(buf) {
        if (!Buffer.isBuffer(buf)) {
            throw new Error("Expecting paramter to be a Buffer type");
        }
        if (32 !== buf.length) {
            console.log(`WARN: Expecting 32 bytes, instead got ${buf.length}, stack trace:`, new Error().stack);
        }
        if (buf.length === 0) {
            throw new Error("Empty buffer");
        }
        return new PrivateKey(BigInteger.fromBuffer(buf));
    }

    /** @arg {string} seed - any length string.  This is private, the same seed produces the same private key every time.  */
    self.fromSeed = function(seed) { // generate_private_key
        if (!(typeof seed === 'string')) {
            throw new Error('seed must be of type string');
        }
        return PrivateKey.fromBuffer(hash.sha256(seed));
    }

    self.isWif = function(text) {
        try {
            this.fromWif(text)
            return true
        } catch(e) {
            return false
        }
    }

    /**
        @throws {AssertError|Error} parsing key
        @return {string} Walvar Import Format (still a secret, Not encrypted)
    */
    self.fromWif = function(_private_wif) {
        var private_wif = new Buffer(base58.decode(_private_wif));
        var version = private_wif.readUInt8(0);
        assert.equal(0x80, version, `Expected version ${0x80}, instead got ${version}`);
        // checksum includes the version
        var private_key = private_wif.slice(0, -4);
        var checksum = private_wif.slice(-4);
        var new_checksum = hash.sha256(private_key);
        new_checksum = hash.sha256(new_checksum);
        new_checksum = new_checksum.slice(0, 4);
        if (checksum.toString() !== new_checksum.toString())
            throw new Error('Invalid WIF key (checksum miss-match)')

        private_key = private_key.slice(1);
        return self.fromBuffer(private_key);
    }

    self.toWif = function() {
        var private_key = this.toBuffer();
        // checksum includes the version
        private_key = Buffer.concat([new Buffer([0x80]), private_key]);
        var checksum = hash.sha256(private_key);
        checksum = hash.sha256(checksum);
        checksum = checksum.slice(0, 4);
        var private_wif = Buffer.concat([private_key, checksum]);
        return base58.encode(private_wif);
    }

    /** Alias for {@link toWif} */
    self.toString = function() {
        return this.toWif()
    }

    /**
        @return {Point}
    */
    self.toPublicKeyPoint = function() {
        var Q;
        return Q = secp256k1.G.multiply(this.d);
    }

    self.toPublic = function() {
        if (this.public_key) { return this.public_key; }
        return this.public_key = PublicKey.fromPoint(this.toPublicKeyPoint());
    }

    self.toBuffer = function() {
        return this.d.toBuffer(32);
    }

    /** ECIES */
    self.get_shared_secret = function(public_key) {
        public_key = toPublic(public_key)
        var KB = public_key.toUncompressed().toBuffer()
        var KBP = Point.fromAffine(
            secp256k1,
            BigInteger.fromBuffer( KB.slice( 1,33 )), // x
            BigInteger.fromBuffer( KB.slice( 33,65 )) // y
        )
        var r = this.toBuffer()
        var P = KBP.multiply(BigInteger.fromBuffer(r))
        var S = P.affineX.toBuffer({size: 32})
        // SHA512 used in ECIES
        return hash.sha512(S)
    }

    // /** ECIES (does not always match the Point.fromAffine version above) */
    // get_shared_secret(public_key){
    //     public_key = toPublic(public_key)
    //     var P = public_key.Q.multiply( this.d );
    //     var S = P.affineX.toBuffer({size: 32});
    //     // ECIES, adds an extra sha512
    //     return hash.sha512(S);
    // }

    /** @throws {Error} - overflow of the key could not be derived */
    self.child = function( offset ) {
        offset = Buffer.concat([ this.toPublicKey().toBuffer(), offset ])
        offset = hash.sha256( offset )
        var c = BigInteger.fromBuffer(offset)

        if (c.compareTo(n) >= 0)
            throw new Error("Child offset went out of bounds, try again")

        var derived = this.d.add(c)//.mod(n)

        if( derived.signum() === 0 )
            throw new Error("Child offset derived to an invalid key, try again")

        return new PrivateKey( derived )
    }

    /* <helper_functions> */

    self.toByteBuffer = function() {
        var b = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
        this.appendByteBuffer(b);
        return b.copy(0, b.offset);
    }

    self.fromHex = function(hex) {
        return PrivateKey.fromBuffer(new Buffer(hex, 'hex'));
    }

    self.toHex = function() {
        return this.toBuffer().toString('hex');
    }

    self.toPublicKey = function() {
        return this.toPublic()
    }

    /* </helper_functions> */
}

module.exports = PrivateKey;

var toPublic = data => data == null ? data :
    data.Q ? data : PublicKey.fromStringOrThrow(data)
