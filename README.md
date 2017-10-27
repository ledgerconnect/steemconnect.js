### Register Your App
You can go to https://v2.steemconnect.com/dashboard to register a new app to use with SteemConnect V2. Note that this will cost 6 STEEM since it will actually create a new Steem account for your app.

Click on "My Apps" and then "+ New App" to set up a new app. Enter a name for your new app's Steem account. A popular convention is [app_name].app, for example Busy.org uses @busy.app.

Next you can fill out the information for your app such as name, description, icon, and URLs. The Redirect URI(s) are important. SteemConnect will only allow redirects to a URI specified here. If you are developing locally you will need to include the local URL you are using in this list for testing.

Once you have created your new app account through the SteemConnect site and filled out the required information your app is registered and you can start developing.

### Init SDK
```
sc2.init({
  app: 'busy',
  callbackURL: 'http://localhost:8000/demo/',
  accessToken: 'access_token',
  scope: ['vote', 'comment']
});
```

### Get user profile
```
sc2.me(function (err, res) {
  console.log(err, res)
});
```

### Vote
```
sc2.vote(voter, author, permlink, weight, function (err, res) {
  console.log(err, res)
});
```

### Logout
```
sc2.revokeToken(function (err, res) {
  console.log(err, res)
});
```

### Generate hot signing link
```
var link = sc2.sign('transfer', {
  to: 'fabien',
  amount: '1.000 STEEM',
  memo: 'Hello World!',
});

console.log(link);
// => https://v2.steemconnect.com/sign/transfer?to=fabien&amount=1.000%20STEEM&memo=Hello%20World!
```
