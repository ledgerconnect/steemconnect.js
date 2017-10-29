## Getting Started
### Example App
Before registering your own app (which costs 6 STEEM) you can experiment with SteemConnect V2 development using the following demo:

- [https://steemit.github.io/sc2-angular](https://steemit.github.io/sc2-angular)

### Register Your App
Once you are ready to register your own app to use with SteemConnect V2 you can do so by following these steps:

1. Go to https://v2.steemconnect.com/dashboard to register a new app to use with SteemConnect V2. Note that this will cost 6 STEEM since it will actually create a new Steem account for your app.

2. Click on "My Apps" and then "+ New App" to set up a new app.

3. Enter a name for your new app's Steem account. A popular convention is [app_name].app, for example Busy uses busy.app.

4. Pay the 6 STEEM account creation fee.

5. Fill out the information for your app such as name, description, icon, and website.

6. Add any URIs you will use for your site to the Redirect URI(s) list. SteemConnect will only allow redirects to a URI specified here. If you are developing locally you will need to include the local URL you are using in this list for testing.

7. Your app should now be registered and you can start developing.

### Include the SC2 SDK in your HTML page
```
<script src="https://steemit.github.io/sc2-angular/sc2.min.js"></script>
```

## SDK Methods
### Init SDK
Call the init() method when your app first loads to initialize the SDK:
```
sc2.init({
  app: 'busy',
  callbackURL: 'http://localhost:8000/demo/',
  accessToken: 'access_token',
  scope: ['vote', 'comment']
});
```
Parameters:
- __app__: This is the name of the app that was registered in the SteemConnect V2 dashboard
- __callbackURL__: This is the URL that users will be redirected to after interacting with SC2. It must be listed in the "Redirect URI(s)" list in the app settings EXACTLY the same as it is specified here
- __accessToken__: If you have an oauth2 access token for this user already you can specify it here, otherwise you can leave it and set it later using sc2.setAccessToken(accessToken).
- __scope__: This is a list of operations the app will be able to access on the user's account. For a complete list of scopes see: [https://github.com/steemit/steemconnect/wiki/OAuth-2#scopes](https://github.com/steemit/steemconnect/wiki/OAuth-2#scopes)

### Get Login URL
The following method returns a URL that you can redirect the user to so that they may log in to your app through SC2:
```
var link = sc2.getLoginUrl(state);
console.log(link)
// => https://v2.steemconnect.com/oauth2/authorize?client_id=[app]&redirect_uri=[callbackURL]&scope=vote,comment&state=[state]
```
Parameters:
- __state__: Data that will be passed to the callbackURL for your app after the user has logged in.

After logging in, SC2 will redirect the user to the "redirect_uri" specified in the login url above and add the following query string parameters for your app to use:
- __accessToken__: This is the oauth2 access token that is required to make any Steem API calls on behalf of the current user. Once you have this you need to tell the SC2 SDK to use it by either specifying it as a parameter to the init() method call or by calling sc2.setAccessToken([accessToken]).
- __expires_in__: The number of seconds until the access token expires.
- __username__: The username of the current user.

### Get user profile
Once a user is logged in to your app you can call the following method to get the details of their account:
```
sc2.me(function (err, res) {
  console.log(err, res)
});
```
If it is successful, the result will be a JSON object with the following properties:
```
account:{id: 338059, name: "yabapmatt", owner: {}, active: {}, posting: {}, ...}
name:"yabapmatt"
scope:["vote"]
user:"yabapmatt"
user_metadata:{}
_id:"yabapmatt"
```

### Vote
The vote() method will cast a vote on the specified post or comment from the current user:
```
sc2.vote(voter, author, permlink, weight, function (err, res) {
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
sc2.comment(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function (err, res) {
  console.log(err, res)
});
```

### Generate hot signing link
The sign() method creates a URL to which your app can redirect the user to perform a signed transaction on the blockchain such as a transfer or delegation:
```
var link = sc2.sign('transfer', {
  to: 'fabien',
  amount: '1.000 STEEM',
  memo: 'Hello World!',
});

console.log(link);
// => https://v2.steemconnect.com/sign/transfer?to=fabien&amount=1.000%20STEEM&memo=Hello%20World!
```

Note that the URL generated by the sign() method does not contain a redirect URI parameter, so the user will not be redirected back to your app once the transaction is completed.

### Logout
The revokeToken() method will log the current user out of your application by revoking the access token provided to your app for that user: 
```
sc2.revokeToken(function (err, res) {
  console.log(err, res)
});
```

### Re-Steem
```
sc2.reblog(account, author, permlink, function (err, res) {
  console.log(err, res)
});
```

### Follow
```
sc2.follow(follower, following, function (err, res) {
  console.log(err, res)
});
```

### Unfollow
```
sc2.unfollow(unfollower, unfollowing, function (err, res) {
  console.log(err, res)
});
```

### Ignore
```
sc2.ignore = (follower, following, function (err, res) {
  console.log(err, res)
});
```

### Claim Reward Balance
```
sc2.claimRewardBalance = (account, rewardSteem, rewardSbd, rewardVests, function (err, res) {
  console.log(err, res)
});
```

### Update User Metadata
```
sc2.updateUserMetadata = (metadata, function (err, res) {
  console.log(err, res)
});
```
