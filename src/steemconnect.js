const fetch = require('isomorphic-fetch');
const qs = require('querystring');
const debug = require('debug')('steemconnect');

const steemconnect = {
  baseURL: 'https://steemconnect.com',
  app: '',
  callbackURL: '',
};

steemconnect.init = (params) => {
  params.baseURL && this.setBaseUrl(params.baseURL);
  params.app && this.setApp(params.app);
  params.callbackURL && this.setCallbackURL(params.callbackURL);
};

steemconnect.setBaseURL = (baseURL) => {
  this.baseURL = baseURL;
};

steemconnect.setApp = (app) => {
  this.app = app;
};

steemconnect.setCallbackURL = (callbackURL) => {
  this.callbackURL = callbackURL;
};

steemconnect.getLoginURL = (callbackURL) => {
  return callbackURL ?
    `${this.baseURL}/authorize/@${this.app}?redirect_url=${callbackURL}` :
    `${this.baseURL}/authorize/@${this.app}?redirect_url=${this.callbackURL}`;
};

steemconnect.send = (name, params, cb) => {
  const url = `${this.baseURL}/api/@${app}/${name}`;
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

steemconnect.isAuthenticated = (cb) => {
  return steemconnect.send('verify', {}, cb);
};

steemconnect.vote = (voter, author, permlink, weight, cb) => {
  const params = {
    voter,
    author,
    permlink,
    weight,
  };
  return steemconnect.send('vote', params, cb);
};

steemconnect.follow = (follower, following, cb) => {
  const params = {
    follower,
    following,
  };
  return steemconnect.send('follow', params, cb);
};

steemconnect.unfollow = (follower, following, cb) => {
  const params = {
    follower,
    following,
  };
  return steemconnect.send('unfollow', params, cb);
};

steemconnect.ignore = (follower, following, cb) => {
  const params = {
    follower,
    following,
  };
  return steemconnect.send('ignore', params, cb);
};

steemconnect.reblog = (account, author, permlink, cb) => {
  const params = {
    account,
    author,
    permlink,
  };
  return steemconnect.send('reblog', params, cb);
};

steemconnect.comment = (parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, cb) => {
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

steemconnect.deleteComment = (author, permlink, cb) => {
  const params = {
    author,
    permlink,
  };
  return steemconnect.send('deleteComment', params, cb);
};

steemconnect.post = (author, permlink, title, body, jsonMetadata, cb) => {
  const params = {
    author,
    permlink,
    title,
    body,
    jsonMetadata,
  };
  return steemconnect.send('post', params, cb);
};

steemconnect.escrowTransfer = (from, to, amount, memo, escrowId, agent, fee, jsonMeta, expiration, cb) => {
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

steemconnect.escrowDispute = (from, to, escrowId, who, cb) => {
  const params = {
    from,
    to,
    escrow_id: escrowId,
    who,
  };
  return steemconnect.send('escrowDispute', params, cb);
};

steemconnect.escrowRelease = (from, to, escrowId, who, amount, cb) => {
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
