const fetch = require('isomorphic-fetch');
const qs = require('querystring');
const debug = require('debug')('steemconnect');

const steemconnect = {
  path: 'https://steemconnect.com/api',
  app: '',
};

exports = module.exports = steemconnect;

steemconnect.setPath = function setPath(path) {
  this.path = path;
  if (this.app.length) {
    this.path += (`/${this.app}`);
  }
};

steemconnect.setApp = function setApp(app) {
  this.app = app;
  steemconnect.setPath(this.path);
};

steemconnect.send = function sendsend(url, params, cb) {
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
  return steemconnect.send(`${this.path}/verify`, {}, cb);
};

steemconnect.vote = function vote(voter, author, permlink, weight, cb) {
  const params = {
    voter,
    author,
    permlink,
    weight,
  };
  return steemconnect.send(`${this.path}/vote`, params, cb);
};

steemconnect.upvote = function upvote(voter, author, permlink, weight, cb) {
  const params = {
    voter,
    author,
    permlink,
    weight,
  };
  return steemconnect.send(`${this.path}/upvote`, params, cb);
};

steemconnect.downvote = function downvote(voter, author, permlink, weight, cb) {
  const params = {
    voter,
    author,
    permlink,
    weight,
  };
  return steemconnect.send(`${this.path}/downvote`, params, cb);
};

steemconnect.follow = function follow(follower, following, cb) {
  const params = {
    follower,
    following,
  };
  return steemconnect.send(`${this.path}/follow`, params, cb);
};

steemconnect.unfollow = function unfollow(follower, following, cb) {
  const params = {
    follower,
    following,
  };
  return steemconnect.send(`${this.path}/unfollow`, params, cb);
};

steemconnect.ignore = function ignore(follower, following, cb) {
  const params = {
    follower,
    following,
  };
  return steemconnect.send(`${this.path}/ignore`, params, cb);
};

steemconnect.reblog = function reblog(account, author, permlink, cb) {
  const params = {
    account,
    author,
    permlink,
  };
  return steemconnect.send(`${this.path}/reblog`, params, cb);
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
  return steemconnect.send(`${this.path}/comment`, params, cb);
};

steemconnect.deleteComment = function deleteComment(author, permlink, cb) {
  const params = {
    author,
    permlink,
  };
  return steemconnect.send(`${this.path}/deleteComment`, params, cb);
};

steemconnect.post = function post(author, permlink, title, body, jsonMetadata, cb) {
  const params = {
    author,
    permlink,
    title,
    body,
    jsonMetadata,
  };
  return steemconnect.send(`${this.path}/post`, params, cb);
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
  return steemconnect.send(`${this.path}/escrowTransfer`, params, cb);
};

steemconnect.escrowDispute = function escrowDispute(from, to, escrowId, who, cb) {
  const params = {
    from,
    to,
    escrow_id: escrowId,
    who,
  };
  return steemconnect.send(`${this.path}/escrowDispute`, params, cb);
};

steemconnect.escrowRelease = function escrowRelease(from, to, escrowId, who, amount, cb) {
  const params = {
    from,
    to,
    escrow_id: escrowId,
    who,
    amount,
  };
  return steemconnect.send(`${this.path}/escrowRelease`, params, cb);
};
