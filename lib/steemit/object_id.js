console.log('object_id');

var Long = (require('bytebuffer')).Long;

var v = require('./validation');
var DB_MAX_INSTANCE_ID = Long.fromNumber(((Math.pow(2,48))-1));

var ObjectId = function(space, type, instance){
    var self = this;
    this.space = space;
    this.type = type;
    this.instance = instance;
    var instance_string = this.instance.toString();
    var object_id = this.space + this.type + instance_string;
    if (!v.is_digits(instance_string)) {
        throw new `Invalid object id ${object_id}`();
    }

    self.fromString = function(value){
        if (
            value.space !== undefined && 
            value.type !== undefined &&
            value.instance !== undefined
        ) {
            return value;
        }
        var params = v.require_match(
            /^([0-9]+)\.([0-9]+)\.([0-9]+)$/,
            v.required(value, "object_id"),
            "object_id"
        );
        return new ObjectId(
            parseInt(params[1]),
            parseInt(params[2]),
            Long.fromString(params[3])
        );
    }
    
    self.fromLong = function(long){
        var space = long.shiftRight(56).toInt();
        var type = long.shiftRight(48).toInt() & 0x00ff;
        var instance = long.and(DB_MAX_INSTANCE_ID);
        return new ObjectId(space, type, instance);
    }
    
    self.fromByteBuffer = function(b){
        return self.fromLong(b.readUint64());
    }
        
    self.toLong = function() {
        return Long.fromNumber(self.space).shiftLeft(56).or(
            Long.fromNumber(self.type).shiftLeft(48).or(self.instance)
        );
    }
    
    self.appendByteBuffer = function(b){
        return b.writeUint64(self.toLong());
    }
    
    self.toString = function() {
        return self.space + self.type + self.instance.toString();
    }
}

module.exports = ObjectId;
