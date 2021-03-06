// source: sgn/staking/v1/tx.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = (function() {
  if (this) { return this; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  if (typeof self !== 'undefined') { return self; }
  return Function('return this')();
}.call(null));

var sgn_staking_v1_staking_pb = require('../../../sgn/staking/v1/staking_pb.js');
goog.object.extend(proto, sgn_staking_v1_staking_pb);
goog.exportSymbol('proto.sgn.staking.v1.MsgEditDescription', null, global);
goog.exportSymbol('proto.sgn.staking.v1.MsgSetTransactors', null, global);
goog.exportSymbol('proto.sgn.staking.v1.SetTransactorsOp', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.staking.v1.MsgSetTransactors = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.staking.v1.MsgSetTransactors.repeatedFields_, null);
};
goog.inherits(proto.sgn.staking.v1.MsgSetTransactors, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.staking.v1.MsgSetTransactors.displayName = 'proto.sgn.staking.v1.MsgSetTransactors';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.staking.v1.MsgEditDescription = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.staking.v1.MsgEditDescription, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.staking.v1.MsgEditDescription.displayName = 'proto.sgn.staking.v1.MsgEditDescription';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.staking.v1.MsgSetTransactors.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.staking.v1.MsgSetTransactors.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.staking.v1.MsgSetTransactors.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.staking.v1.MsgSetTransactors} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.staking.v1.MsgSetTransactors.toObject = function(includeInstance, msg) {
  var f, obj = {
    operation: jspb.Message.getFieldWithDefault(msg, 1, 0),
    transactorsList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
    sender: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.staking.v1.MsgSetTransactors}
 */
proto.sgn.staking.v1.MsgSetTransactors.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.staking.v1.MsgSetTransactors;
  return proto.sgn.staking.v1.MsgSetTransactors.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.staking.v1.MsgSetTransactors} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.staking.v1.MsgSetTransactors}
 */
proto.sgn.staking.v1.MsgSetTransactors.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.sgn.staking.v1.SetTransactorsOp} */ (reader.readEnum());
      msg.setOperation(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.addTransactors(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setSender(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.staking.v1.MsgSetTransactors.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.staking.v1.MsgSetTransactors.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.staking.v1.MsgSetTransactors} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.staking.v1.MsgSetTransactors.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOperation();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getTransactorsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      2,
      f
    );
  }
  f = message.getSender();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional SetTransactorsOp operation = 1;
 * @return {!proto.sgn.staking.v1.SetTransactorsOp}
 */
proto.sgn.staking.v1.MsgSetTransactors.prototype.getOperation = function() {
  return /** @type {!proto.sgn.staking.v1.SetTransactorsOp} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.sgn.staking.v1.SetTransactorsOp} value
 * @return {!proto.sgn.staking.v1.MsgSetTransactors} returns this
 */
proto.sgn.staking.v1.MsgSetTransactors.prototype.setOperation = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * repeated string transactors = 2;
 * @return {!Array<string>}
 */
proto.sgn.staking.v1.MsgSetTransactors.prototype.getTransactorsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sgn.staking.v1.MsgSetTransactors} returns this
 */
proto.sgn.staking.v1.MsgSetTransactors.prototype.setTransactorsList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sgn.staking.v1.MsgSetTransactors} returns this
 */
proto.sgn.staking.v1.MsgSetTransactors.prototype.addTransactors = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.staking.v1.MsgSetTransactors} returns this
 */
proto.sgn.staking.v1.MsgSetTransactors.prototype.clearTransactorsList = function() {
  return this.setTransactorsList([]);
};


/**
 * optional string sender = 3;
 * @return {string}
 */
proto.sgn.staking.v1.MsgSetTransactors.prototype.getSender = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.staking.v1.MsgSetTransactors} returns this
 */
proto.sgn.staking.v1.MsgSetTransactors.prototype.setSender = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.staking.v1.MsgEditDescription.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.staking.v1.MsgEditDescription.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.staking.v1.MsgEditDescription} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.staking.v1.MsgEditDescription.toObject = function(includeInstance, msg) {
  var f, obj = {
    description: (f = msg.getDescription()) && sgn_staking_v1_staking_pb.Description.toObject(includeInstance, f),
    sender: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.staking.v1.MsgEditDescription}
 */
proto.sgn.staking.v1.MsgEditDescription.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.staking.v1.MsgEditDescription;
  return proto.sgn.staking.v1.MsgEditDescription.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.staking.v1.MsgEditDescription} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.staking.v1.MsgEditDescription}
 */
proto.sgn.staking.v1.MsgEditDescription.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new sgn_staking_v1_staking_pb.Description;
      reader.readMessage(value,sgn_staking_v1_staking_pb.Description.deserializeBinaryFromReader);
      msg.setDescription(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSender(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.staking.v1.MsgEditDescription.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.staking.v1.MsgEditDescription.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.staking.v1.MsgEditDescription} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.staking.v1.MsgEditDescription.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDescription();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      sgn_staking_v1_staking_pb.Description.serializeBinaryToWriter
    );
  }
  f = message.getSender();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional Description description = 1;
 * @return {?proto.sgn.staking.v1.Description}
 */
proto.sgn.staking.v1.MsgEditDescription.prototype.getDescription = function() {
  return /** @type{?proto.sgn.staking.v1.Description} */ (
    jspb.Message.getWrapperField(this, sgn_staking_v1_staking_pb.Description, 1));
};


/**
 * @param {?proto.sgn.staking.v1.Description|undefined} value
 * @return {!proto.sgn.staking.v1.MsgEditDescription} returns this
*/
proto.sgn.staking.v1.MsgEditDescription.prototype.setDescription = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.staking.v1.MsgEditDescription} returns this
 */
proto.sgn.staking.v1.MsgEditDescription.prototype.clearDescription = function() {
  return this.setDescription(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.staking.v1.MsgEditDescription.prototype.hasDescription = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string sender = 2;
 * @return {string}
 */
proto.sgn.staking.v1.MsgEditDescription.prototype.getSender = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.staking.v1.MsgEditDescription} returns this
 */
proto.sgn.staking.v1.MsgEditDescription.prototype.setSender = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * @enum {number}
 */
proto.sgn.staking.v1.SetTransactorsOp = {
  NOP: 0,
  OVERWRITE: 1,
  ADD: 2,
  REMOVE: 3
};

goog.object.extend(exports, proto.sgn.staking.v1);
