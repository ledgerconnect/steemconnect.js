'use strict';

var fetch = require('isomorphic-fetch');

var sc2 = {
  baseURL: 'https://v2.steemconnect.com',
  app: '',
  callbackURL: ''
};

sc2.init = function (params) {
  params.baseURL && sc2.setBaseURL(params.baseURL);
  params.app && sc2.setApp(params.app);
  params.callbackURL && sc2.setCallbackURL(params.callbackURL);
  params.accessToken && sc2.setAccessToken(params.accessToken);
};

sc2.setBaseURL = function (baseURL) {
  return sc2.baseURL = baseURL;
};
sc2.setApp = function (app) {
  return sc2.app = app;
};
sc2.setCallbackURL = function (callbackURL) {
  return sc2.callbackURL = callbackURL;
};
sc2.setAccessToken = function (accessToken) {
  return sc2.accessToken = accessToken;
};

sc2.getLoginURL = function (callbackURL) {
  var redirectUri = callbackURL || sc2.callbackURL;
  return sc2.baseURL + '/oauth2/authorize?client_id=' + sc2.app + '&redirect_uri=' + encodeURIComponent(redirectUri);
};

sc2.send = function (route, body, cb) {
  var url = sc2.baseURL + '/api/v1/' + route;
  var retP = fetch(url + '?access_token=' + sc2.accessToken, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(function (res) {
    if (res.status >= 400) {
      throw new Error('SteemConnect API call failed with ' + res.status);
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

sc2.broadcast = function (operations, cb) {
  return sc2.send('broadcast', { operations: operations }, cb);
};
sc2.me = function (cb) {
  return sc2.send('me', {}, cb);
};

sc2.vote = function (voter, author, permlink, weight, cb) {
  var params = {
    voter: voter,
    author: author,
    permlink: permlink,
    weight: weight
  };
  return sc2.broadcast([['vote', params]], cb);
};

sc2.comment = function (parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, cb) {
  var params = {
    parent_author: parentAuthor,
    parent_permlink: parentPermlink,
    author: author,
    permlink: permlink,
    title: title,
    body: body,
    json_metadata: jsonMetadata
  };
  return sc2.broadcast([['comment', params]], cb);
};

exports = module.exports = sc2;