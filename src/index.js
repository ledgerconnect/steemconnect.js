import fetch from 'cross-fetch';
import { encodeOps } from 'steem-uri';

const BASE_URL = 'https://steemconnect.com';
const API_URL = 'https://api.steemconnect.com';

const hasChromeExtension = () => window && window._steemconnect;

const sign = (name, params, redirectUri) => {
  if (typeof name !== 'string' || typeof params !== 'object') {
    return {
      error: 'invalid_request',
      error_description: 'Request has an invalid format',
    };
  }
  let url = `${BASE_URL}/sign/${name}?`;
  url += Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  url += redirectUri ? `&redirect_uri=${encodeURIComponent(redirectUri)}` : '';
  return url;
};

class Client {
  constructor(config) {
    this.apiURL = config.apiURL || API_URL;
    this.app = config.app;
    this.callbackURL = config.callbackURL;
    this.accessToken = config.accessToken;
    this.scope = config.scope || [];
  }

  setBaseURL() {
    console.warn('The function "setBaseUrl" is deprecated.');
    return this;
  }

  setApiURL(apiURL) {
    this.apiURL = apiURL;
    return this;
  }

  setApp(app) {
    this.app = app;
    return this;
  }

  setCallbackURL(app) {
    this.app = app;
    return this;
  }

  callbackURL(callbackURL) {
    this.callbackURL = callbackURL;
    return this;
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
    return this;
  }

  removeAccessToken() {
    delete this.accessToken;
    return this;
  }

  setScope(scope) {
    this.scope = scope;
    return this;
  }

  getLoginURL(state) {
    let loginURL = `${BASE_URL}/oauth2/authorize?client_id=${
      this.app
    }&redirect_uri=${encodeURIComponent(this.callbackURL)}`;
    loginURL += this.scope ? `&scope=${this.scope.join(',')}` : '';
    loginURL += state ? `&state=${encodeURIComponent(state)}` : '';
    return loginURL;
  }

  login(options, cb) {
    if (hasChromeExtension()) {
      const params = {};
      if (this.app) params.app = this.app;
      if (options.authority) params.authority = options.authority;
      window._steemconnect.login(params, cb);
    } else if (window) {
      window.location = this.getLoginURL(options.state);
    }
  }

  send(route, method, body, cb) {
    const url = `${this.apiURL}/api/${route}`;
    const promise = fetch(url, {
      method,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        Authorization: this.accessToken,
      },
      body: JSON.stringify(body),
    })
      .then(res => {
        const json = res.json();
        if (res.status !== 200) {
          return json.then(result => Promise.reject(result));
        }
        return json;
      })
      .then(res => {
        if (res.error) {
          return Promise.reject(res);
        }
        return res;
      });

    if (!cb) return promise;

    return promise.then(res => cb(null, res)).catch(err => cb(err, null));
  }

  me(cb) {
    return this.send('me', 'POST', {}, cb);
  }

  broadcast(operations, cb) {
    if (hasChromeExtension()) {
      const uri = encodeOps(operations);
      return window._steemconnect.sign(uri, cb);
    }
    return this.send('broadcast', 'POST', { operations }, cb);
  }

  vote(voter, author, permlink, weight, cb) {
    const params = {
      voter,
      author,
      permlink,
      weight,
    };
    return this.broadcast([['vote', params]], cb);
  }

  comment(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, cb) {
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
  }

  deleteComment(author, permlink, cb) {
    const params = {
      author,
      permlink,
    };
    return this.broadcast([['delete_comment', params]], cb);
  }

  customJson(requiredAuths, requiredPostingAuths, id, json, cb) {
    const params = {
      required_auths: requiredAuths,
      required_posting_auths: requiredPostingAuths,
      id,
      json,
    };
    return this.broadcast([['custom_json', params]], cb);
  }

  reblog(account, author, permlink, cb) {
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
  }

  follow(follower, following, cb) {
    const params = {
      required_auths: [],
      required_posting_auths: [follower],
      id: 'follow',
      json: JSON.stringify(['follow', { follower, following, what: ['blog'] }]),
    };
    return this.broadcast([['custom_json', params]], cb);
  }

  unfollow(unfollower, unfollowing, cb) {
    const params = {
      required_auths: [],
      required_posting_auths: [unfollower],
      id: 'follow',
      json: JSON.stringify(['follow', { follower: unfollower, following: unfollowing, what: [] }]),
    };
    return this.broadcast([['custom_json', params]], cb);
  }

  ignore(follower, following, cb) {
    const params = {
      required_auths: [],
      required_posting_auths: [follower],
      id: 'follow',
      json: JSON.stringify(['follow', { follower, following, what: ['ignore'] }]),
    };
    return this.broadcast([['custom_json', params]], cb);
  }

  claimRewardBalance(account, rewardSteem, rewardSbd, rewardVests, cb) {
    const params = {
      account,
      reward_steem: rewardSteem,
      reward_sbd: rewardSbd,
      reward_vests: rewardVests,
    };
    return this.broadcast([['claim_reward_balance', params]], cb);
  }

  revokeToken(cb) {
    return this.send('oauth2/token/revoke', 'POST', { token: this.accessToken }, cb).then(() =>
      this.removeAccessToken(),
    );
  }

  updateUserMetadata(metadata = {}, cb) {
    return this.send('me', 'PUT', { user_metadata: metadata }, cb);
  }
}

const Initialize = config => {
  console.warn('The function "Initialize" is deprecated, please use the class "Client" instead.');
  return new Client(config);
};

export default {
  Client,
  Initialize,
  sign,
};
