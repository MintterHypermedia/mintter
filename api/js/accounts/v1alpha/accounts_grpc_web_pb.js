/**
 * @fileoverview gRPC-Web generated client stub for com.mintter.accounts.v1alpha
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');


var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js')
const proto = {};
proto.com = {};
proto.com.mintter = {};
proto.com.mintter.accounts = {};
proto.com.mintter.accounts.v1alpha = require('./accounts_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.com.mintter.accounts.v1alpha.AccountsClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.com.mintter.accounts.v1alpha.AccountsPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.com.mintter.accounts.v1alpha.GetAccountRequest,
 *   !proto.com.mintter.accounts.v1alpha.Account>}
 */
const methodDescriptor_Accounts_GetAccount = new grpc.web.MethodDescriptor(
  '/com.mintter.accounts.v1alpha.Accounts/GetAccount',
  grpc.web.MethodType.UNARY,
  proto.com.mintter.accounts.v1alpha.GetAccountRequest,
  proto.com.mintter.accounts.v1alpha.Account,
  /**
   * @param {!proto.com.mintter.accounts.v1alpha.GetAccountRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.com.mintter.accounts.v1alpha.Account.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.com.mintter.accounts.v1alpha.GetAccountRequest,
 *   !proto.com.mintter.accounts.v1alpha.Account>}
 */
const methodInfo_Accounts_GetAccount = new grpc.web.AbstractClientBase.MethodInfo(
  proto.com.mintter.accounts.v1alpha.Account,
  /**
   * @param {!proto.com.mintter.accounts.v1alpha.GetAccountRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.com.mintter.accounts.v1alpha.Account.deserializeBinary
);


/**
 * @param {!proto.com.mintter.accounts.v1alpha.GetAccountRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.com.mintter.accounts.v1alpha.Account)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.com.mintter.accounts.v1alpha.Account>|undefined}
 *     The XHR Node Readable Stream
 */
proto.com.mintter.accounts.v1alpha.AccountsClient.prototype.getAccount =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/com.mintter.accounts.v1alpha.Accounts/GetAccount',
      request,
      metadata || {},
      methodDescriptor_Accounts_GetAccount,
      callback);
};


/**
 * @param {!proto.com.mintter.accounts.v1alpha.GetAccountRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.com.mintter.accounts.v1alpha.Account>}
 *     A native promise that resolves to the response
 */
proto.com.mintter.accounts.v1alpha.AccountsPromiseClient.prototype.getAccount =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/com.mintter.accounts.v1alpha.Accounts/GetAccount',
      request,
      metadata || {},
      methodDescriptor_Accounts_GetAccount);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.com.mintter.accounts.v1alpha.Profile,
 *   !proto.com.mintter.accounts.v1alpha.Account>}
 */
const methodDescriptor_Accounts_UpdateProfile = new grpc.web.MethodDescriptor(
  '/com.mintter.accounts.v1alpha.Accounts/UpdateProfile',
  grpc.web.MethodType.UNARY,
  proto.com.mintter.accounts.v1alpha.Profile,
  proto.com.mintter.accounts.v1alpha.Account,
  /**
   * @param {!proto.com.mintter.accounts.v1alpha.Profile} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.com.mintter.accounts.v1alpha.Account.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.com.mintter.accounts.v1alpha.Profile,
 *   !proto.com.mintter.accounts.v1alpha.Account>}
 */
const methodInfo_Accounts_UpdateProfile = new grpc.web.AbstractClientBase.MethodInfo(
  proto.com.mintter.accounts.v1alpha.Account,
  /**
   * @param {!proto.com.mintter.accounts.v1alpha.Profile} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.com.mintter.accounts.v1alpha.Account.deserializeBinary
);


/**
 * @param {!proto.com.mintter.accounts.v1alpha.Profile} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.com.mintter.accounts.v1alpha.Account)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.com.mintter.accounts.v1alpha.Account>|undefined}
 *     The XHR Node Readable Stream
 */
proto.com.mintter.accounts.v1alpha.AccountsClient.prototype.updateProfile =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/com.mintter.accounts.v1alpha.Accounts/UpdateProfile',
      request,
      metadata || {},
      methodDescriptor_Accounts_UpdateProfile,
      callback);
};


/**
 * @param {!proto.com.mintter.accounts.v1alpha.Profile} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.com.mintter.accounts.v1alpha.Account>}
 *     A native promise that resolves to the response
 */
proto.com.mintter.accounts.v1alpha.AccountsPromiseClient.prototype.updateProfile =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/com.mintter.accounts.v1alpha.Accounts/UpdateProfile',
      request,
      metadata || {},
      methodDescriptor_Accounts_UpdateProfile);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.com.mintter.accounts.v1alpha.ListAccountsRequest,
 *   !proto.com.mintter.accounts.v1alpha.ListAccountsResponse>}
 */
const methodDescriptor_Accounts_ListAccounts = new grpc.web.MethodDescriptor(
  '/com.mintter.accounts.v1alpha.Accounts/ListAccounts',
  grpc.web.MethodType.UNARY,
  proto.com.mintter.accounts.v1alpha.ListAccountsRequest,
  proto.com.mintter.accounts.v1alpha.ListAccountsResponse,
  /**
   * @param {!proto.com.mintter.accounts.v1alpha.ListAccountsRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.com.mintter.accounts.v1alpha.ListAccountsResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.com.mintter.accounts.v1alpha.ListAccountsRequest,
 *   !proto.com.mintter.accounts.v1alpha.ListAccountsResponse>}
 */
const methodInfo_Accounts_ListAccounts = new grpc.web.AbstractClientBase.MethodInfo(
  proto.com.mintter.accounts.v1alpha.ListAccountsResponse,
  /**
   * @param {!proto.com.mintter.accounts.v1alpha.ListAccountsRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.com.mintter.accounts.v1alpha.ListAccountsResponse.deserializeBinary
);


/**
 * @param {!proto.com.mintter.accounts.v1alpha.ListAccountsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.com.mintter.accounts.v1alpha.ListAccountsResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.com.mintter.accounts.v1alpha.ListAccountsResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.com.mintter.accounts.v1alpha.AccountsClient.prototype.listAccounts =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/com.mintter.accounts.v1alpha.Accounts/ListAccounts',
      request,
      metadata || {},
      methodDescriptor_Accounts_ListAccounts,
      callback);
};


/**
 * @param {!proto.com.mintter.accounts.v1alpha.ListAccountsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.com.mintter.accounts.v1alpha.ListAccountsResponse>}
 *     A native promise that resolves to the response
 */
proto.com.mintter.accounts.v1alpha.AccountsPromiseClient.prototype.listAccounts =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/com.mintter.accounts.v1alpha.Accounts/ListAccounts',
      request,
      metadata || {},
      methodDescriptor_Accounts_ListAccounts);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryRequest,
 *   !proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryResponse>}
 */
const methodDescriptor_Accounts_StartAccountDiscovery = new grpc.web.MethodDescriptor(
  '/com.mintter.accounts.v1alpha.Accounts/StartAccountDiscovery',
  grpc.web.MethodType.UNARY,
  proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryRequest,
  proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryResponse,
  /**
   * @param {!proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryRequest,
 *   !proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryResponse>}
 */
const methodInfo_Accounts_StartAccountDiscovery = new grpc.web.AbstractClientBase.MethodInfo(
  proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryResponse,
  /**
   * @param {!proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryResponse.deserializeBinary
);


/**
 * @param {!proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.com.mintter.accounts.v1alpha.AccountsClient.prototype.startAccountDiscovery =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/com.mintter.accounts.v1alpha.Accounts/StartAccountDiscovery',
      request,
      metadata || {},
      methodDescriptor_Accounts_StartAccountDiscovery,
      callback);
};


/**
 * @param {!proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.com.mintter.accounts.v1alpha.StartAccountDiscoveryResponse>}
 *     A native promise that resolves to the response
 */
proto.com.mintter.accounts.v1alpha.AccountsPromiseClient.prototype.startAccountDiscovery =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/com.mintter.accounts.v1alpha.Accounts/StartAccountDiscovery',
      request,
      metadata || {},
      methodDescriptor_Accounts_StartAccountDiscovery);
};


module.exports = proto.com.mintter.accounts.v1alpha;

