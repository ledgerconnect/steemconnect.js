'use strict';

var fetch = require('isomorphic-fetch');
var qs = require('querystring');
var debug = require('debug')('steemconnect');

var SC = {
  baseURL: 'https://steemconnect.com',
  app: '',
  callbackURL: ''
};

SC.init = function (params) {
  params.baseURL && SC.setBaseURL(params.baseURL);
  params.app && SC.setApp(params.app);
  params.callbackURL && SC.setCallbackURL(params.callbackURL);
};

SC.setBaseURL = function (baseURL) {
  SC.baseURL = baseURL;
};

SC.setApp = function (app) {
  SC.app = app;
};

SC.setCallbackURL = function (callbackURL) {
  SC.callbackURL = callbackURL;
};

SC.getLoginURL = function (callbackURL) {
  return callbackURL ? SC.baseURL + '/authorize/@' + SC.app + '?redirect_url=' + callbackURL : SC.baseURL + '/authorize/@' + SC.app + '?redirect_url=' + SC.callbackURL;
};

SC.send = function (name, params, cb) {
  var url = SC.baseURL + '/api/@' + SC.app + '/' + name;
  var retP = fetch(url + '?' + qs.stringify(params), {
    credentials: 'include'
  }).then(function (res) {
    debug('GET ' + res.status + ' ' + url);
    if (res.status >= 400) {
      var err = new Error('Steem Connect API call failed with ' + res.status);
      err.res = res;
      throw err;
    }
    return res.json();
  });

  if (!cb) return retP;

  return retP.then(function (ret) {
    cb(null, ret);
  }, function (err) {
    cb(err);
  });
};

SC.isAuthenticated = function (cb) {
  return SC.send('verify', {}, cb);
};

SC.vote = function (voter, author, permlink, weight, cb) {
  var params = {
    voter: voter,
    author: author,
    permlink: permlink,
    weight: weight
  };
  return SC.send('vote', params, cb);
};

SC.follow = function (follower, following, cb) {
  var params = {
    follower: follower,
    following: following
  };
  return SC.send('follow', params, cb);
};

SC.unfollow = function (follower, following, cb) {
  var params = {
    follower: follower,
    following: following
  };
  return SC.send('unfollow', params, cb);
};

SC.ignore = function (follower, following, cb) {
  var params = {
    follower: follower,
    following: following
  };
  return SC.send('ignore', params, cb);
};

SC.reblog = function (account, author, permlink, cb) {
  var params = {
    account: account,
    author: author,
    permlink: permlink
  };
  return SC.send('reblog', params, cb);
};

SC.comment = function (parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, cb) {
  var params = {
    parentAuthor: parentAuthor,
    parentPermlink: parentPermlink,
    author: author,
    permlink: permlink,
    title: title,
    body: body,
    jsonMetadata: jsonMetadata
  };
  return SC.send('comment', params, cb);
};

SC.deleteComment = function (author, permlink, cb) {
  var params = {
    author: author,
    permlink: permlink
  };
  return SC.send('deleteComment', params, cb);
};

SC.post = function (author, permlink, title, body, jsonMetadata, cb) {
  var params = {
    author: author,
    permlink: permlink,
    title: title,
    body: body,
    jsonMetadata: jsonMetadata
  };
  return SC.send('post', params, cb);
};

SC.escrowTransfer = function (from, to, amount, memo, escrowId, agent, fee, jsonMeta, expiration, cb) {
  var params = {
    from: from,
    to: to,
    amount: amount,
    memo: memo,
    escrow_id: escrowId,
    agent: agent,
    fee: fee,
    json_meta: jsonMeta,
    expiration: expiration
  };
  return SC.send('escrowTransfer', params, cb);
};

SC.escrowDispute = function (from, to, escrowId, who, cb) {
  var params = {
    from: from,
    to: to,
    escrow_id: escrowId,
    who: who
  };
  return SC.send('escrowDispute', params, cb);
};

SC.escrowRelease = function (from, to, escrowId, who, amount, cb) {
  var params = {
    from: from,
    to: to,
    escrow_id: escrowId,
    who: who,
    amount: amount
  };
  return SC.send('escrowRelease', params, cb);
};

exports = module.exports = SC;