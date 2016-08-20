var ByteBuffer = require('bytebuffer');

var Serializer = function(operation_name, types){
    var self = this;
    self.operation_name = operation_name
    self.types = types
    if(self.types) self.keys = Object.keys(self.types)
    self.printDebug = true;

    self.appendByteBuffer = function(b, object) {
        try {
            var iterable = this.keys;
            for (var i = 0, field; i < iterable.length; i++) {
                field = iterable[i];
                var type = this.types[field];
                type.appendByteBuffer(b, object[field]);
            }

        } catch (error) { }
        return;
    }

    self.toByteBuffer = function(object) {
        var b = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
        this.appendByteBuffer(b, object);
        return b.copy(0, b.offset);
    }

    self.toBuffer = function(object){
        return new Buffer(this.toByteBuffer(object).toBinary(), 'binary');
    }

    return this;
}

module.exports = Serializer