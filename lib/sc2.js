'use strict';

var fetch = require('isomorphic-fetch');

var sc2 = {
  baseURL: 'https://v2.steemconnect.com',
  app: '',
  callbackURL: '',
  scope: []
};

sc2.init = function (params) {
  params.baseURL && sc2.setBaseURL(params.baseURL);
  params.app && sc2.setApp(params.app);
  params.callbackURL && sc2.setCallbackURL(params.callbackURL);
  params.accessToken && sc2.setAccessToken(params.accessToken);
  params.scope && sc2.setScope(params.scope);
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
sc2.removeAccessToken = function () {
  return sc2.accessToken = undefined;
};
sc2.setScope = function (scope) {
  return sc2.scope = scope;
};

sc2.getLoginURL = function (callbackURL) {
  var redirectUri = callbackURL || sc2.callbackURL;
  var scope = sc2.scope ? '&scope=' + sc2.scope.join(',') : '';
  return sc2.baseURL + '/oauth2/authorize?client_id=' + sc2.app + '&redirect_uri=' + encodeURIComponent(redirectUri) + scope;
};

sc2.send = function (route, method, body, cb) {
  var url = sc2.baseURL + '/api/' + route;
  var retP = fetch(url, {
    method: method,
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: sc2.accessToken
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
  return sc2.send('broadcast', 'POST', { operations: operations }, cb);
};
sc2.me = function (cb) {
  return sc2.send('me', 'POST', {}, cb);
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
    json_metadata: JSON.stringify(jsonMetadata)
  };
  return sc2.broadcast([['comment', params]], cb);
};

sc2.reblog = function (account, author, permlink, cb) {
  var params = {
    required_auths: [],
    required_posting_auths: [account],
    id: 'follow',
    json: JSON.stringify(['reblog', {
      account: account,
      author: author,
      permlink: permlink
    }])
  };
  return sc2.broadcast([['custom_json', params]], cb);
};

sc2.follow = function (follower, following, cb) {
  var params = {
    required_auths: [],
    required_posting_auths: [follower],
    id: 'follow',
    json: JSON.stringify(['follow', { follower: follower, following: following, what: ['blog'] }])
  };
  return sc2.broadcast([['custom_json', params]], cb);
};

sc2.unfollow = function (unfollower, unfollowing, cb) {
  var params = {
    required_auths: [],
    required_posting_auths: [unfollower],
    id: 'follow',
    json: JSON.stringify(['follow', { follower: unfollower, following: unfollowing, what: [] }])
  };
  return sc2.broadcast([['custom_json', params]], cb);
};

sc2.ignore = function (follower, following, cb) {
  var params = {
    required_auths: [],
    required_posting_auths: [follower],
    id: 'follow',
    json: JSON.stringify(['follow', { follower: follower, following: following, what: ['ignore'] }])
  };
  return sc2.broadcast([['custom_json', params]], cb);
};

sc2.claimRewardBalance = function (account, rewardSteem, rewardSbd, rewardVests, cb) {
  var params = {
    account: account,
    reward_steem: rewardSteem,
    reward_sbd: rewardSbd,
    reward_vests: rewardVests
  };
  return sc2.broadcast([['claim_reward_balance', params]], cb);
};

sc2.revokeToken = function (cb) {
  var url = sc2.baseURL + '/api/oauth2/token/revoke';
  var retP = fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: sc2.accessToken
    }
  }).then(function (res) {
    if (res.status >= 400) {
      throw new Error('SteemConnect API call failed with ' + res.status);
    }
    return res.json();
  });
  return retP.then(function (ret) {
    sc2.removeAccessToken();
    cb(null, ret);
  }, function (err) {
    cb(err);
  });
};

sc2.updateUserMetadata = function () {
  var metadata = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var cb = arguments[1];

  return sc2.send('me', 'PUT', { user_metadata: metadata }, cb);
};

exports = module.exports = sc2;