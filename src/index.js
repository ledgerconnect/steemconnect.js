import fetch from 'cross-fetch';
import { encodeOps } from 'steem-uri';

const BASE_URL = 'https://steemconnect.com';
const API_URL = 'https://api.steemconnect.com';

const hasChromeExtension = () => window && window._steemconnect;

class SDKError extends Error {
  constructor(message, obj) {
    super(message);
    this.name = 'SDKError';
    this.error = obj.error;
    this.error_description = obj.error_description;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

function SteemConnect() {
  this.options = {
    apiURL: API_URL,
    app: '',
    callbackURL: '',
    scope: [],
  };
}

/**
 * @deprecated since version 2.1.0
 */
SteemConnect.prototype.setBaseURL = function setBaseURL() {
  console.warn('The function "setBaseUrl" is deprecated.');
};
SteemConnect.prototype.setApiURL = function setApiURL(apiURL) {
  this.options.apiURL = apiURL;
};
SteemConnect.prototype.setApp = function setApp(app) {
  this.options.app = app;
};
SteemConnect.prototype.setCallbackURL = function setCallbackURL(callbackURL) {
  this.options.callbackURL = callbackURL;
};
SteemConnect.prototype.setAccessToken = function setAccessToken(accessToken) {
  this.options.accessToken = accessToken;
};
SteemConnect.prototype.removeAccessToken = function removeAccessToken() {
  this.options.accessToken = undefined;
};
SteemConnect.prototype.setScope = function setScope(scope) {
  this.options.scope = scope;
};

SteemConnect.prototype.getLoginURL = function getLoginURL(state) {
  let loginURL = `${BASE_URL}/oauth2/authorize?client_id=${
    this.options.app
  }&redirect_uri=${encodeURIComponent(this.options.callbackURL)}`;
  loginURL += this.options.scope ? `&scope=${this.options.scope.join(',')}` : '';
  loginURL += state ? `&state=${encodeURIComponent(state)}` : '';
  return loginURL;
};

SteemConnect.prototype.login = function login(options, cb) {
  if (hasChromeExtension()) {
    const params = {
      app: this.app ? this.app : undefined,
    };
    window._steemconnect.login(params, cb);
  } else if (window) {
    const loginUrl = this.getLoginURL(options.state);
    const win = window.open(loginUrl, '_blank');
    win.focus();
  }
};

SteemConnect.prototype.send = function send(route, method, body, cb) {
  const url = `${this.options.apiURL}/api/${route}`;
  const promise = fetch(url, {
    method,
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: this.options.accessToken,
    },
    body: JSON.stringify(body),
  })
    .then(res => {
      const json = res.json();
      // If the status is something other than 200 we need
      // to reject the result since the request is not considered as a fail
      if (res.status !== 200) {
        return json.then(result => Promise.reject(new SDKError('steemconnect error', result)));
      }
      return json;
    })
    .then(res => {
      if (res.error) {
        return Promise.reject(new SDKError('steemconnect error', res));
      }
      return res;
    });

  if (!cb) return promise;

  return promise.then(res => cb(null, res)).catch(err => cb(err, null));
};

SteemConnect.prototype.broadcast = function broadcast(operations, cb) {
  if (hasChromeExtension()) {
    const uri = encodeOps(operations);
    return window._steemconnect.sign(uri, cb);
  }
  return this.send('broadcast', 'POST', { operations }, cb);
};

SteemConnect.prototype.me = function me(cb) {
  return this.send('me', 'POST', {}, cb);
};

SteemConnect.prototype.vote = function vote(voter, author, permlink, weight, cb) {
  const params = {
    voter,
    author,
    permlink,
    weight,
  };
  return this.broadcast([['vote', params]], cb);
};

SteemConnect.prototype.comment = function comment(
  parentAuthor,
  parentPermlink,
  author,
  permlink,
  title,
  body,
  jsonMetadata,
  cb,
) {
  const params = {
    parent_author: parentAuthor,
    parent_permlink: parentPermlink,
    author,
    permlink,
    title,
    body,
    json_metadata: JSON.stringify(jsonMetadata),
  };
  return this.broadcast([['comment', params]], cb);
};

SteemConnect.prototype.deleteComment = function deleteComment(author, permlink, cb) {
  const params = {
    author,
    permlink,
  };
  return this.broadcast([['delete_comment', params]], cb);
};

SteemConnect.prototype.reblog = function reblog(account, author, permlink, cb) {
  const params = {
    required_auths: [],
    required_posting_auths: [account],
    id: 'follow',
    json: JSON.stringify([
      'reblog',
      {
        account,
        author,
        permlink,
      },
    ]),
  };
  return this.broadcast([['custom_json', params]], cb);
};

SteemConnect.prototype.follow = function follow(follower, following, cb) {
  const params = {
    required_auths: [],
    required_posting_auths: [follower],
    id: 'follow',
    json: JSON.stringify(['follow', { follower, following, what: ['blog'] }]),
  };
  return this.broadcast([['custom_json', params]], cb);
};

SteemConnect.prototype.unfollow = function unfollow(unfollower, unfollowing, cb) {
  const params = {
    required_auths: [],
    required_posting_auths: [unfollower],
    id: 'follow',
    json: JSON.stringify(['follow', { follower: unfollower, following: unfollowing, what: [] }]),
  };
  return this.broadcast([['custom_json', params]], cb);
};

SteemConnect.prototype.ignore = function ignore(follower, following, cb) {
  const params = {
    required_auths: [],
    required_posting_auths: [follower],
    id: 'follow',
    json: JSON.stringify(['follow', { follower, following, what: ['ignore'] }]),
  };
  return this.broadcast([['custom_json', params]], cb);
};

SteemConnect.prototype.claimRewardBalance = function claimRewardBalance(
  account,
  rewardSteem,
  rewardSbd,
  rewardVests,
  cb,
) {
  const params = {
    account,
    reward_steem: rewardSteem,
    reward_sbd: rewardSbd,
    reward_vests: rewardVests,
  };
  return this.broadcast([['claim_reward_balance', params]], cb);
};

SteemConnect.prototype.revokeToken = function revokeToken(cb) {
  return this.send('oauth2/token/revoke', 'POST', { token: this.options.accessToken }, cb).then(
    () => this.removeAccessToken(),
  );
};

SteemConnect.prototype.updateUserMetadata = function updateUserMetadata(metadata = {}, cb) {
  return this.send('me', 'PUT', { user_metadata: metadata }, cb);
};

SteemConnect.prototype.sign = function sign(name, params, redirectUri) {
  if (typeof name !== 'string' || typeof params !== 'object') {
    return new SDKError('steemconnect error', {
      error: 'invalid_request',
      error_description: 'Request has an invalid format',
    });
  }
  let url = `${BASE_URL}/sign/${name}?`;
  url += Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  url += redirectUri ? `&redirect_uri=${encodeURIComponent(redirectUri)}` : '';
  return url;
};

const Initialize = function Initialize(config) {
  const instance = new SteemConnect();

  if (!config) {
    throw new Error('You have to provide config');
  }

  if (typeof config !== 'object') {
    throw new Error('Config must be an object');
  }

  if (config.apiURL) instance.setApiURL(config.apiURL);
  if (config.app) instance.setApp(config.app);
  if (config.callbackURL) instance.setCallbackURL(config.callbackURL);
  if (config.accessToken) instance.setAccessToken(config.accessToken);
  if (config.scope) instance.setScope(config.scope);

  return instance;
};

export default {
  Initialize,
};
