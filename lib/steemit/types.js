
var v = require('./validation');

var Types = {};

Types.uint16 = {
    fromByteBuffer: function(b){
        return b.readUint16();
    },
    appendByteBuffer: function(b, object){
        v.require_range(0,0xFFFF,object, `uint16 ${object}`);
        b.writeUint16(object);
        return;
    },
    fromObject: function(object){
        v.require_range(0,0xFFFF,object, `uint16 ${object}`);
        return object;
    },
    toObject: function(object, debug ){
        if (debug.use_default && object === undefined) { return 0; }
        v.require_range(0,0xFFFF,object, `uint16 ${object}`);
        return parseInt(object);
    }
};

Types.uint32 = {
    fromByteBuffer: function(b){
        return b.readUint32();
    },
    appendByteBuffer: function(b, object){
        v.require_range(0,0xFFFFFFFF,object, `uint32 ${object}`);
        b.writeUint32(object);
        return;
    },
    fromObject: function(object){
        v.require_range(0,0xFFFFFFFF,object, `uint32 ${object}`);
        return object;
    },
    toObject: function(object, debug ){
        if (debug.use_default && object === undefined) { return 0; }
        v.require_range(0,0xFFFFFFFF,object, `uint32 ${object}`);
        return parseInt(object);
    }
};


Types.int16 = {
    fromByteBuffer: function(b){
        return b.readInt16();
    },
    appendByteBuffer: function(b, object){
        b.writeInt16(object);
        return;
    },
    fromObject: function(object){
        return object;
    },
    toObject: function(object, debug){
        if (debug.use_default && object === undefined) { return 0; }
        return parseInt(object);
    }
};

Types.uint64 = {
    fromByteBuffer: function(b){
        return b.readUint64();
    },
    appendByteBuffer: function(b, object){
        b.writeUint64(v.to_long(v.unsigned(object)));
        return;
    },
    fromObject: function(object){
        return v.to_long(v.unsigned(object));
    },
    toObject: function(object, debug ){
        if (debug.use_default && object === undefined) { return "0"; }
        return v.to_long(object).toString();
    }
    };

Types.string = {
    fromByteBuffer: function(b){
        var b_copy;
        var len = b.readVarint32();
        b_copy = b.copy(b.offset, b.offset + len), b.skip(len);
        return new Buffer(b_copy.toBinary(), 'binary');
    },
    appendByteBuffer: function(b, object){
        v.required(object);
        b.writeVarint32(object.length);
        b.append(object.toString('binary'), 'binary');
        return;
    },
    fromObject: function(object){
        v.required(object);
        return new Buffer(object);
    },
    toObject: function(object, debug ){
        if (debug.use_default && object === undefined) { return ""; }
        return object.toString();
    }
};

Types.bytes = function(size){
    return {
        fromByteBuffer: function(b){
        if (size === undefined) {
            var b_copy;
            var len = b.readVarint32();
            b_copy = b.copy(b.offset, b.offset + len), b.skip(len);
            return new Buffer(b_copy.toBinary(), 'binary');
        } else {
            b_copy = b.copy(b.offset, b.offset + size), b.skip(size);
            return new Buffer(b_copy.toBinary(), 'binary');
        }
    },
    appendByteBuffer: function(b, object){
        v.required(object);
        if(typeof object === "string")
            object = new Buffer(object, "hex")

        if (size === undefined) {
            b.writeVarint32(object.length);
        }
        b.append(object.toString('binary'), 'binary');
        return;
    },
    fromObject: function(object){
        v.required(object);
        if( Buffer.isBuffer(object) )
            return object

        return new Buffer(object, 'hex');
    },
    toObject: function(object, debug ){
        if (debug.use_default && object === undefined) {
            var zeros=function(num){ return new Array( num ).join( "00" ); };
            return zeros(size);
        }
        v.required(object);
        return object.toString('hex');
    }
    };
};

Types.bool = {
    fromByteBuffer: function(b){
        return b.readUint8() === 1
    },
    appendByteBuffer: function(b, object){
        // supports boolean or integer
        b.writeUint8(JSON.parse(object) ? 1 : 0);
        return;
    },
    fromObject: function(object){
        return JSON.parse(object) ? true : false
    },
    toObject: function(object, debug ){
        if (debug.use_default && object === undefined) { return false; }
        return JSON.parse(object) ? true : false
    }
};

Types.void = {
    fromByteBuffer: function(b){
        throw new Error("(void) undefined type");
    },
    appendByteBuffer: function(b, object){
        throw new Error("(void) undefined type");
    },
    fromObject: function(object){
        throw new Error("(void) undefined type");
    },
    toObject: function(object, debug ){
        if (debug.use_default && object === undefined) {
            return undefined;
        }
        throw new Error("(void) undefined type");
    }
};

Types.array = function(st_operation){
    return {
    fromByteBuffer: function(b){
        var size = b.readVarint32();
        var result = [];
        for (var i = 0; 0 < size ? i < size : i > size; 0 < size ? i++ : i++) {
            result.push(st_operation.fromByteBuffer(b));
        }
        return sortOperation(result, st_operation);
    },
    appendByteBuffer: function(b, object){
        v.required(object)
        object = sortOperation(object, st_operation)
        b.writeVarint32(object.length);
        for (var i = 0, o; i < object.length; i++) {
            o = object[i];
            st_operation.appendByteBuffer(b, o);
        }
    },
    fromObject: function(object){
        v.required(object)
        object = sortOperation(object, st_operation)
        var result = [];
        for (var i = 0, o; i < object.length; i++) {
            o = object[i];
            result.push(st_operation.fromObject(o));
        }
        return result;
    },
    toObject: function(object, debug ){
        if (debug.use_default && object === undefined) {
            return [ st_operation.toObject(object, debug) ];
        }
        v.required(object)
        object = sortOperation(object, st_operation)

        var result = [];
        for (var i = 0, o; i < object.length; i++) {
            o = object[i];
            result.push(st_operation.toObject(o, debug));
        }
        return result;
    }
    };
};

Types.time_point_sec = {
    fromByteBuffer: function(b){ return b.readUint32(); },
    appendByteBuffer: function(b, object){
        if(typeof object !== "number")
            object = Types.time_point_sec.fromObject(object)

        b.writeUint32(object);
        return;
    },
    fromObject: function(object){
        v.required(object)

        if(typeof object === "number")
            return object

        if(object.getTime)
            return Math.floor( object.getTime() / 1000 );

        if(typeof object !== "string")
            throw new Error("Unknown date type: " + object)

        // if(typeof object === "string" && !/Z$/.test(object))
        //     object = object + "Z"

        return Math.floor( new Date(object).getTime() / 1000 );
    },
    toObject: function(object, debug ){
        if (debug.use_default && object === undefined)
            return (new Date(0)).toISOString().split('.')[0];

        v.required(object)

        if(typeof object === "string")
            return object

        if(object.getTime)
            return object.toISOString().split('.')[0]

        var int = parseInt(object);
        v.require_range(0,0xFFFFFFFF,int, `uint32 ${object}`);
        return (new Date( int * 1000 )).toISOString().split('.')[0];
    }
}

Types.set = function(st_operation){
    return {
        validate: function(array){
        var dup_map ;
        for (var i = 0, o; i < array.length; i++) {
            o = array[i];
            var ref;
            if (ref = typeof o, ['string', 'number'].indexOf(ref) >= 0) {
                if (dup_map[o] !== undefined) {
                    throw new Error("duplicate (set)");
                }
                dup_map[o] = true;
            }
        }
        return sortOperation(array, st_operation);
    },
    fromByteBuffer: function(b){
        var size = b.readVarint32();
        return this.validate(((() => {
            var result = [];
            for (var i = 0; 0 < size ? i < size : i > size; 0 < size ? i++ : i++) {
                result.push(st_operation.fromByteBuffer(b));
            }
            return result;
        })()));
    },
    appendByteBuffer: function(b, object){
        if (!object) { object = []; }
        b.writeVarint32(object.length);
        var iterable = this.validate(object);
        for (var i = 0, o; i < iterable.length; i++) {
            o = iterable[i];
            st_operation.appendByteBuffer(b, o);
        }
        return;
    },
    fromObject: function(object){
        if (!object) { object = []; }
        return this.validate(((() => {
            var result = [];
            for (var i = 0, o; i < object.length; i++) {
                o = object[i];
                result.push(st_operation.fromObject(o));
            }
            return result;
        })()));
    },
    toObject(object, debug ){
        if (debug.use_default && object === undefined) {
            return [ st_operation.toObject(object, debug) ];
        }
        if (!object) { object = []; }
        return this.validate(((() => {
            var result = [];
            for (var i = 0, o; i < object.length; i++) {
                o = object[i];
                result.push(st_operation.toObject(o, debug));
            }
            return result;
        })()));
    }
    };
};



Types.optional = function(st_operation){
    v.required(st_operation, "st_operation");
    return {
    fromByteBuffer: function(b){
        if (!(b.readUint8() === 1)) {
            return undefined;
        }
        return st_operation.fromByteBuffer(b);
    },
    appendByteBuffer: function(b, object){
        if (object !== null && object !== undefined) {
            b.writeUint8(1);
            st_operation.appendByteBuffer(b, object);
        } else {
            b.writeUint8(0);
        }
        return;
    },
    fromObject: function(object){
        if (object === undefined) { return undefined; }
        return st_operation.fromObject(object);
    },
    toObject: function(object, debug ){
        // toObject is only null save if use_default is true
        var result_object = (() => {
            if (!debug.use_default && object === undefined) {
                return undefined;
            } else {
                return st_operation.toObject(object, debug);
            }
        })();

        if (debug.annotate) {
            if (typeof result_object === "object") {
                result_object.__optional = "parent is optional";
            } else {
                result_object = {__optional: result_object};
            }
        }
        return result_object;
    }
    };
};

Types.static_variant = function(_st_operations){
    return {
        nosort: true,
        st_operations: _st_operations,
    opTypeId : function(value) {
        var pos = 0, type_id
        if(typeof value === "number")
            type_id = value
        else {
            for(var op of this.st_operations) {
                if(op.operation_name === value) {
                    type_id = pos
                    break
                }
                pos++
            }
        }
        return type_id
    },
    appendByteBuffer: function(b, object){
        v.required(object);
        var type_id = this.opTypeId(object[0]);
        var st_operation = this.st_operations[type_id];
        v.required(st_operation, `operation ${type_id}`);
        b.writeVarint32(type_id);
        st_operation.appendByteBuffer(b, object[1]);
        return;
    },
    };
};

Types.map = function(){};

var sortOperation = (array, st_operation) => {
    return st_operation.nosort ? array :
    st_operation.compare ?
    array.sort((a,b)=> st_operation.compare(firstEl(a), firstEl(b))) : // custom compare operation
    array.sort((a,b)=>
        typeof firstEl(a) === "number" && typeof firstEl(b) === "number" ? firstEl(a) - firstEl(b) :
        // A binary string compare does not work. Performanance is very good so HEX is used..  localeCompare is another option.
        Buffer.isBuffer(firstEl(a)) && Buffer.isBuffer(firstEl(b)) ? strCmp(firstEl(a).toString("hex"), firstEl(b).toString("hex")) :
        strCmp(firstEl(a).toString(), firstEl(b).toString())
    )
}

module.exports = Types