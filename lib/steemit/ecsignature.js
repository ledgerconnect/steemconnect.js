var assert = require('assert');

var BigInteger = require('bigi');

function ECSignature(r, s) {
  this.r = r;
  this.s = s;
}

// Import operations
ECSignature.parseCompact = function(buffer) {
  assert.equal(buffer.length, 65, 'Invalid signature length');
  var i = buffer.readUInt8(0) - 27;

  // At most 3 bits
  assert.equal(i, i & 7, 'Invalid signature parameter');
  var compressed = !!(i & 4);

  // Recovery param only
  i = i & 3;

  var r = BigInteger.fromBuffer(buffer.slice(1, 33));
  var s = BigInteger.fromBuffer(buffer.slice(33));

  return {
    compressed: compressed,
    i: i,
    signature: new ECSignature(r, s)
  }
}



ECSignature.prototype.toDER = function() {
  var rBa = this.r.toDERInteger();
  var sBa = this.s.toDERInteger();

  var sequence = [];

  // INTEGER
  sequence.push(0x02, rBa.length);
  sequence = sequence.concat(rBa);

  // INTEGER
  sequence.push(0x02, sBa.length);
  sequence = sequence.concat(sBa);

  // SEQUENCE
  sequence.unshift(0x30, sequence.length);

  return new Buffer(sequence)
};

module.exports = ECSignature;
