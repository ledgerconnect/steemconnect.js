# SteemConnect v2 SDK

# Init SDK
```
sc2.init({
  app: 'busy',
  callbackURL: 'http://localhost:8000/demo/',
  accessToken: 'access_token',
  scope: ['vote', 'comment']
});
```

# Get user profile
```
sc2.me(function (err, res) {
  console.log(err, res)
});
```

# Vote
```
sc2.vote(voter, author, permlink, weight, function (err, res) {
  console.log(err, res)
});
```