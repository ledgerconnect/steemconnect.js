'use strict';

var fetch = require('isomorphic-fetch');
var qs = require('querystring');

var debug = require('debug')('steemconnect');

var steemconnect = {};
var basePath = 'https://steemconnect.com/api';

exports = module.exports = steemconnect;

steemconnect.send = function send(url, params, cb) {
  var retP = fetch(url + '?' + qs.stringify(params), {
      credentials: 'include',
    })
    .then(function (res) {
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

steemconnect.isAuthenticated = function (cb) {
  return steemconnect.send(`${basePath}/verify`, {}, cb);
};

steemconnect.vote = function (voter, author, permlink, weight, cb) {
  var params = {
    voter: voter,
    author: author,
    permlink: permlink,
    weight: weight
  };
  return steemconnect.send(`${basePath}/vote`, params, cb);
};

steemconnect.upvote = function (voter, author, permlink, weight, cb) {
  var params = {
    voter: voter,
    author: author,
    permlink: permlink,
    weight: weight
  };
  return steemconnect.send(`${basePath}/upvote`, params, cb);
};

steemconnect.downvote = function (voter, author, permlink, weight, cb) {
  var params = {
    voter: voter,
    author: author,
    permlink: permlink,
    weight: weight
  };
  return steemconnect.send(`${basePath}/downvote`, params, cb);
};

steemconnect.follow = function (follower, following, cb) {
  var params = {
    follower: follower,
    following: following
  };
  return steemconnect.send(`${basePath}/follow`, params, cb);
};

steemconnect.unfollow = function (follower, following, cb) {
  var params = {
    follower: follower,
    following: following
  };
  return steemconnect.send(`${basePath}/unfollow`, params, cb);
};

steemconnect.ignore = function (follower, following, cb) {
  var params = {
    follower: follower,
    following: following
  };
  return steemconnect.send(`${basePath}/ignore`, params, cb);
};

steemconnect.reblog = function (account, author, permlink, cb) {
  var params = {
    account: account,
    author: author,
    permlink: permlink
  };
  return steemconnect.send(`${basePath}/reblog`, params, cb);
};

steemconnect.comment = function (parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, cb) {
  var params = {
    parentAuthor: parentAuthor,
    parentPermlink: parentPermlink,
    author: author,
    permlink: permlink,
    title: title,
    body: body,
    jsonMetadata: jsonMetadata
  };
  return steemconnect.send(`${basePath}/comment`, params, cb);
};

steemconnect.deleteComment = function (author, permlink, cb) {
  var params = {
    author: author,
    permlink: permlink
  };
  return steemconnect.send(`${basePath}/deleteComment`, params, cb);
};

steemconnect.post = function (author, permlink, title, body, jsonMetadata, cb) {
  var params = {
    author: author,
    permlink: permlink,
    title: title,
    body: body,
    jsonMetadata: jsonMetadata
  };
  return steemconnect.send(`${basePath}/post`, params, cb);
};

steemconnect.escrowTransfer = function (from, to, amount, memo, escrowId, agent, fee, jsonMeta, expiration, cb) {
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
  return steemconnect.send(`${basePath}/escrowTransfer`, params, cb);
};

steemconnect.escrowDispute = function (from, to, escrowId, who, cb) {
  var params = {
    from: from,
    to: to,
    escrow_id: escrowId,
    who: who
  };
  return steemconnect.send(`${basePath}/escrowDispute`, params, cb);
};

steemconnect.escrowRelease = function (from, to, escrowId, who, amount, cb) {
  var params = {
    from: from,
    to: to,
    escrow_id: escrowId,
    who: who,
    amount: amount
  };
  return steemconnect.send(`${basePath}/escrowRelease`, params, cb);
};
