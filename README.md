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