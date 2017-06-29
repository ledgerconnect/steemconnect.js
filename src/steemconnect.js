const fetch = require('isomorphic-fetch');
const qs = require('qs');
const debug = require('debug')('steemconnect');

const SC = {
  baseURL: 'https://steemconnect.com',
  app: '',
  callbackURL: '',
};

SC.init = (params) => {
  params.baseURL && SC.setBaseURL(params.baseURL);
  params.app && SC.setApp(params.app);
  params.callbackURL && SC.setCallbackURL(params.callbackURL);
};

SC.setBaseURL = (baseURL) => {
  SC.baseURL = baseURL;
};

SC.setApp = (app) => {
  SC.app = app;
};

SC.setCallbackURL = (callbackURL) => {
  SC.callbackURL = callbackURL;
};

SC.getLoginURL = (callbackURL) => {
  return callbackURL ?
    `${SC.baseURL}/authorize/@${SC.app}?redirect_url=${callbackURL}` :
    `${SC.baseURL}/authorize/@${SC.app}?redirect_url=${SC.callbackURL}`;
};

SC.send = (name, params, cb) => {
  const url = `${SC.baseURL}/api/@${SC.app}/${name}`;
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

SC.isAuthenticated = (cb) => {
  return SC.send('verify', {}, cb);
};

SC.vote = (voter, author, permlink, weight, cb) => {
  const params = {
    voter,
    author,
    permlink,
    weight,
  };
  return SC.send('vote', params, cb);
};

SC.follow = (follower, following, cb) => {
  const params = {
    follower,
    following,
  };
  return SC.send('follow', params, cb);
};

SC.unfollow = (unfollower, unfollowing, cb) => {
  const params = {
    unfollower,
    unfollowing,
  };
  return SC.send('unfollow', params, cb);
};

SC.ignore = (follower, following, cb) => {
  const params = {
    follower,
    following,
  };
  return SC.send('ignore', params, cb);
};

SC.reblog = (account, author, permlink, cb) => {
  const params = {
    account,
    author,
    permlink,
  };
  return SC.send('reblog', params, cb);
};

SC.comment = (parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, cb) => {
  const params = {
    parentAuthor,
    parentPermlink,
    author,
    permlink,
    title,
    body,
    jsonMetadata,
  };
  return SC.send('comment', params, cb);
};

SC.deleteComment = (author, permlink, cb) => {
  const params = {
    author,
    permlink,
  };
  return SC.send('deleteComment', params, cb);
};

SC.post = (author, permlink, title, body, jsonMetadata, cb) => {
  const params = {
    author,
    permlink,
    title,
    body,
    jsonMetadata,
  };
  return SC.send('post', params, cb);
};

SC.escrowTransfer = (from, to, amount, memo, escrowId, agent, fee, jsonMeta, expiration, cb) => {
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
  return SC.send('escrowTransfer', params, cb);
};

SC.escrowDispute = (from, to, escrowId, who, cb) => {
  const params = {
    from,
    to,
    escrow_id: escrowId,
    who,
  };
  return SC.send('escrowDispute', params, cb);
};

SC.escrowRelease = (from, to, escrowId, who, amount, cb) => {
  const params = {
    from,
    to,
    escrow_id: escrowId,
    who,
    amount,
  };
  return SC.send('escrowRelease', params, cb);
};

SC.customJson = (requiredAuths, requiredPostingAuths, id, json, cb) => {
  const params = {
    id,
    json,
    requiredPostingAuths,
    requiredAuths,
  };
  return SC.send('customJson', params, cb);
};

exports = module.exports = SC;
