[![npm](https://img.shields.io/npm/v/steemconnect.svg)](https://www.npmjs.com/package/steemconnect)
![npm](https://img.shields.io/npm/dm/steemconnect.svg)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/steemscript/steemconnect.js/master/LICENSE)

# SteemConnect.js

SteemConnect JavaScript SDK.

## Getting started

To install and run SteemConnect.js, follow this quick start guide

### Install

SteemConnect.js was designed to work both in the browser and in Node.js.

#### Node.js
To install SteemConnect.js on Node.js, open your terminal and run:
```
npm i steemconnect --save
```

#### Browser

You can create an index.html file and include SteemConnect.js with:

```html
<script src="https://cdn.jsdelivr.net/npm/steemconnect@latest"></script>
```

### Usage

For general information about SteemConnect V2 and setting up your app you can follow these guides:

- [How to configure SteemConnect v2 and use it with your application](https://steemit.com/steemconnect/@noisy/how-to-configure-steemconnect-v2-and-use-it-with-your-application-how-it-works-and-how-it-is-different-from-v1)
- [JS: Steemconnect - Steem Developer](https://developers.steem.io/tutorials-javascript/steemconnect)

## SDK Methods
### Init SDK
Call the Initialize() method when your app first loads to initialize the SDK:
```
var sc = require('steemconnect');

var api = sc.Initialize({
  app: 'busy',
  callbackURL: 'http://localhost:8000/demo/',
  accessToken: 'access_token',
  scope: ['vote', 'comment']
});
```
Parameters:
- __app__: This is the name of the app that was registered in the SteemConnect V2 dashboard
- __callbackURL__: This is the URL that users will be redirected to after interacting with SteemConnect. It must be listed in the "Redirect URI(s)" list in the app settings EXACTLY the same as it is specified here
- __accessToken__: If you have an oauth2 access token for this user already you can specify it here, otherwise you can leave it and set it later using sc.setAccessToken(accessToken).
- __scope__: This is a list of operations the app will be able to access on the user's account. For a complete list of scopes see: [https://github.com/steemscript/steemconnect/wiki/OAuth-2#scopes](https://github.com/steemscript/steemconnect/wiki/OAuth-2#scopes)

### Get Login URL
The following method returns a URL that you can redirect the user to so that they may log in to your app through SteemConnect:
```
var link = api.getLoginURL(state);
console.log(link)
// => https://steemconnect.com/oauth2/authorize?client_id=[app]&redirect_uri=[callbackURL]&scope=vote,comment&state=[state]
```
Parameters:
- __state__: Data that will be passed to the callbackURL for your app after the user has logged in.

After logging in, SteemConnect will redirect the user to the "redirect_uri" specified in the login url above and add the following query string parameters for your app to use:
- __access_token__: This is the oauth2 access token that is required to make any Steem API calls on behalf of the current user. Once you have this you need to tell the SteemConnect.js to use it by either specifying it as a parameter to the init() method call or by calling sc2.setAccessToken([accessToken]).
- __expires_in__: The number of seconds until the access token expires.
- __username__: The username of the current user.

### Get user profile
Once a user is logged in to your app you can call the following method to get the details of their account:
```
api.me(function (err, res) {
  console.log(err, res)
});
```
If it is successful, the result will be a JSON object with the following properties:
```
{
  account: { id: 338059, name: "yabapmatt", ...},
  name: "yabapmatt",
  scope: ["vote"],
  user: "yabapmatt",
  user_metadata: {},
  _id: "yabapmatt"
}
```

### Vote
The vote() method will cast a vote on the specified post or comment from the current user:
```
api.vote(voter, author, permlink, weight, function (err, res) {
  console.log(err, res)
});
```
Parameters:
- __voter__: The Steem username of the current user.
- __author__: The Steem username of the author of the post or comment.
- __permlink__: The link to the post or comment on which to vote. This is the portion of the URL after the last "/". For example the "permlink" for this post: https://steemit.com/steem/@ned/announcing-smart-media-tokens-smts would be "announcing-smart-media-tokens-smts".
- __weight__: The weight of the vote. 10000 equale a 100% vote.
- __callback__: A function that is called once the vote is submitted and included in a block. If successful the "res" variable will be a JSON object containing the details of the block and the vote operation.

### Comment
The comment() method will post a comment on an existing post or comment from the current user:
```
api.comment(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function (err, res) {
  console.log(err, res)
});
```
The comment() method is rate limited to 5 minutes per root comment (post), and 20 seconds per non-root comment (reply).

### Delete Comment
The deleteComment() method will mark a comment as deleted.
```
api.deleteComment(author, permlink, function (err, res) {
  console.log(err, res)
})
```

### Generate hot signing link
The sign() method creates a URL to which your app can redirect the user to perform a signed transaction on the blockchain such as a transfer or delegation:
```
var link = api.sign('transfer', {
  to: 'fabien',
  amount: '1.000 STEEM',
  memo: 'Hello World!',
}, 'http://localhost:8000/demo/transfer-complete');

console.log(link);
// => https://steemconnect.com/sign/transfer?to=fabien&amount=1.000%20STEEM&memo=Hello%20World!&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fdemo%2Ftransfer-complete
```

### Logout
The revokeToken() method will log the current user out of your application by revoking the access token provided to your app for that user: 
```
api.revokeToken(function (err, res) {
  console.log(err, res)
});
```

### Reblog
```
api.reblog(account, author, permlink, function (err, res) {
  console.log(err, res)
});
```

### Follow
```
api.follow(follower, following, function (err, res) {
  console.log(err, res)
});
```

### Unfollow
```
api.unfollow(unfollower, unfollowing, function (err, res) {
  console.log(err, res)
});
```

### Ignore
```
api.ignore(follower, following, function (err, res) {
  console.log(err, res)
});
```

### Claim Reward Balance
```
api.claimRewardBalance(account, rewardSteem, rewardSbd, rewardVests, function (err, res) {
  console.log(err, res)
});
```

### Update User Metadata
```
api.updateUserMetadata(metadata, function (err, res) {
  console.log(err, res)
});
```
