const fetch = require('isomorphic-fetch');
const qs = require('querystring');
const debug = require('debug')('steemconnect');

const steemconnect = {
  baseUrl: 'https://steemconnect.com',
  app: '',
};

steemconnect.init = function init(params) {
  params.baseUrl && this.setBaseUrl(params.baseUrl);
  params.app && this.setApp(params.app);
};

steemconnect.setBaseUrl = function setPath(baseUrl) {
  this.baseUrl = baseUrl;
};

steemconnect.setApp = function setApp(app) {
  this.app = app;
};

steemconnect.getLoginUrl = function getLoginUrl(redirectURL) {
  return redirectURL ?
    `${this.baseUrl}/authorize/@${this.app}?redirect_url=${redirectURL}` :
    `${this.baseUrl}/authorize/@${this.app}`;
};

steemconnect.send = function send(name, params, cb) {
  const url = `${this.baseUrl}/api/@${app}/${name}`;
  const retP = fetch(`${url}?${qs.stringify(params)}`, {
    credentials: 'include',
  })
    .then((res) => {
      debug(`GET ${res.status} ${url}`);
      if (res.status >= 400) {
        const err = new Error(`Steem Connect API call failed with ${res.status}`);
        err.res = res;
        throw err;
      }
      return res.json();
    });

  if (!cb) return retP;

  return retP.then((ret) => {
    cb(null, ret);
  }, (err) => {
    cb(err);
  });
};

steemconnect.isAuthenticated = function isAuthenticated(cb) {
  return steemconnect.send('verify', {}, cb);
};

steemconnect.vote = function vote(voter, author, permlink, weight, cb) {
  const params = {
    voter,
    author,
    permlink,
    weight,
  };
  return steemconnect.send('vote', params, cb);
};

steemconnect.upvote = function upvote(voter, author, permlink, weight, cb) {
  const params = {
    voter,
    author,
    permlink,
    weight,
  };
  return steemconnect.send('upvote', params, cb);
};

steemconnect.downvote = function downvote(voter, author, permlink, weight, cb) {
  const params = {
    voter,
    author,
    permlink,
    weight,
  };
  return steemconnect.send('downvote', params, cb);
};

steemconnect.follow = function follow(follower, following, cb) {
  const params = {
    follower,
    following,
  };
  return steemconnect.send('follow', params, cb);
};

steemconnect.unfollow = function unfollow(follower, following, cb) {
  const params = {
    follower,
    following,
  };
  return steemconnect.send('unfollow', params, cb);
};

steemconnect.ignore = function ignore(follower, following, cb) {
  const params = {
    follower,
    following,
  };
  return steemconnect.send('ignore', params, cb);
};

steemconnect.reblog = function reblog(account, author, permlink, cb) {
  const params = {
    account,
    author,
    permlink,
  };
  return steemconnect.send('reblog', params, cb);
};

steemconnect.comment = function comment(parentAuthor, parentPermlink,
  author, permlink, title, body, jsonMetadata, cb) {
  const params = {
    parentAuthor,
    parentPermlink,
    author,
    permlink,
    title,
    body,
    jsonMetadata,
  };
  return steemconnect.send('comment', params, cb);
};

steemconnect.deleteComment = function deleteComment(author, permlink, cb) {
  const params = {
    author,
    permlink,
  };
  return steemconnect.send('deleteComment', params, cb);
};

steemconnect.post = function post(author, permlink, title, body, jsonMetadata, cb) {
  const params = {
    author,
    permlink,
    title,
    body,
    jsonMetadata,
  };
  return steemconnect.send('post', params, cb);
};

steemconnect.escrowTransfer = function escrowTransfer(from, to, amount, memo, escrowId,
  agent, fee, jsonMeta, expiration, cb) {
  const params = {
    from,
    to,
    amount,
    memo,
    escrow_id: escrowId,
    agent,
    fee,
    json_meta: jsonMeta,
    expiration,
  };
  return steemconnect.send('escrowTransfer', params, cb);
};

steemconnect.escrowDispute = function escrowDispute(from, to, escrowId, who, cb) {
  const params = {
    from,
    to,
    escrow_id: escrowId,
    who,
  };
  return steemconnect.send('escrowDispute', params, cb);
};

steemconnect.escrowRelease = function escrowRelease(from, to, escrowId, who, amount, cb) {
  const params = {
    from,
    to,
    escrow_id: escrowId,
    who,
    amount,
  };
  return steemconnect.send('escrowRelease', params, cb);
};

exports = module.exports = steemconnect;
