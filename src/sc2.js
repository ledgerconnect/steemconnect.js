const fetch = require('isomorphic-fetch');

const sc2 = {
  baseURL: 'https://v2.steemconnect.com',
  app: '',
  callbackURL: '',
  scope: []
};

sc2.init = (params) => {
  params.baseURL && sc2.setBaseURL(params.baseURL);
  params.app && sc2.setApp(params.app);
  params.callbackURL && sc2.setCallbackURL(params.callbackURL);
  params.accessToken && sc2.setAccessToken(params.accessToken);
  params.scope && sc2.setScope(params.scope);
};

sc2.setBaseURL = (baseURL) => sc2.baseURL = baseURL;
sc2.setApp = (app) => sc2.app = app;
sc2.setCallbackURL = (callbackURL) => sc2.callbackURL = callbackURL;
sc2.setAccessToken = (accessToken) => sc2.accessToken = accessToken;
sc2.removeAccessToken = () => sc2.accessToken = undefined;
sc2.setScope = (scope) => sc2.scope = scope;

sc2.getLoginURL = (callbackURL) => {
  const redirectUri = callbackURL || sc2.callbackURL;
  const scope = sc2.scope ? `&scope=${sc2.scope.join(',')}` : '';
  return `${sc2.baseURL}/oauth2/authorize?client_id=${sc2.app}&redirect_uri=${encodeURIComponent(redirectUri)}${scope}`;
};

sc2.send = (route, method, body, cb) => {
  const url = `${sc2.baseURL}/api/${route}`;
  const retP = fetch(url, {
    method: method,
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: sc2.accessToken,
    },
    body: JSON.stringify(body)
  }).then((res) => {
    if (res.status >= 400) {
      throw new Error(`SteemConnect API call failed with ${res.status}`);
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

sc2.broadcast = (operations, cb) => sc2.send('broadcast', 'POST', { operations }, cb);
sc2.me = (cb) => sc2.send('me', 'POST', {}, cb);

sc2.vote = (voter, author, permlink, weight, cb) => {
  const params = {
    voter,
    author,
    permlink,
    weight,
  };
  return sc2.broadcast([['vote', params]], cb);
};

sc2.comment = (parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, cb) => {
  const params = {
    parent_author: parentAuthor,
    parent_permlink: parentPermlink,
    author,
    permlink,
    title,
    body,
    json_metadata: JSON.stringify(jsonMetadata),
  };
  return sc2.broadcast([['comment', params]], cb);
};

sc2.reblog = (account, author, permlink, cb) => {
  const params = {
    required_auths: [],
    required_posting_auths: [account],
    id: 'follow',
    json: JSON.stringify([
      'reblog', {
        account,
        author,
        permlink,
      }]),
  };
  return sc2.broadcast([['custom_json', params]], cb);
};

sc2.follow = (follower, following, cb) => {
  const params = {
    required_auths: [],
    required_posting_auths: [follower],
    id: 'follow',
    json: JSON.stringify(['follow', { follower, following, what: ['blog'] }]),
  };
  return sc2.broadcast([['custom_json', params]], cb);
};

sc2.unfollow = (unfollower, unfollowing, cb) => {
  const params = {
    required_auths: [],
    required_posting_auths: [unfollower],
    id: 'follow',
    json: JSON.stringify(['follow', { follower: unfollower, following: unfollowing, what: [] }]),
  };
  return sc2.broadcast([['custom_json', params]], cb);
};

sc2.ignore = (follower, following, cb) => {
  const params = {
    required_auths: [],
    required_posting_auths: [follower],
    id: 'follow',
    json: JSON.stringify(['follow', { follower, following, what: ['ignore'] }]),
  };
  return sc2.broadcast([['custom_json', params]], cb);
};

sc2.claimRewardBalance = (account, rewardSteem, rewardSbd, rewardVests, cb) => {
  const params = {
    account,
    reward_steem: rewardSteem,
    reward_sbd: rewardSbd,
    reward_vests: rewardVests,
  };
  return sc2.broadcast([['claim_reward_balance', params]], cb);
};

sc2.revokeToken = (cb) => {
  const url = `${sc2.baseURL}/api/oauth2/token/revoke`;
  const retP = fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: sc2.accessToken,
    },
  }).then((res) => {
    if (res.status >= 400) {
      throw new Error(`SteemConnect API call failed with ${res.status}`);
    }
    return res.json();
  });
  return retP.then((ret) => {
    sc2.removeAccessToken();
    cb(null, ret);
  }, (err) => {
    cb(err);
  });
};

sc2.updateUserMetadata = (metadata = {}, cb) => {
  return sc2.send('me', 'PUT', { user_metadata: metadata }, cb);
};

exports = module.exports = sc2;
