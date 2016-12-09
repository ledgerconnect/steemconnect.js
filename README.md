# SteemConnect JavaScript SDK
SteemConnect JavaScript SDK for Steem blockchain

## CDN 
http://cdn.steemjs.com/lib/latest/steemconnect.min.js<br/>
https://cdn.steemjs.com/lib/latest/steemconnect.min.js<br/>
```html 
<script src="//cdn.steemjs.com/lib/latest/steemconnect.min.js"></script>
```

## Init
```js 
  steemconnect.init({
    app: 'busy.org',
    callbackURL: 'https://busy.org'
  });
```

## Authentication
### Get Login URL
```js 
var loginURL = steemconnect.getLoginURL();
```
### Is Authenticated
```js 
steemconnect.isAuthenticated(function(err, result) {
	console.log(err, result);
});
```

## Broadcast
### Vote
```js
steemconnect.vote(voter, author, permlink, weight, function(err, result) {
	console.log(err, result);
});
```
### Comment
```js
steemconnect.comment(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
	console.log(err, result);
});
```
### Delete Comment
```js
steemconnect.deleteComment(author, permlink, function(err, result) {
	console.log(err, result);
});
```
### Follow
```js
steemconnect.follow(follower, following, function(err, result) {
	console.log(err, result);
});
```
### Ignore
```js
steemconnect.ignore(follower, following, function(err, result) {
	console.log(err, result);
});
```
### Reblog
```js
steemconnect.reblog(account, author, permlink, function(err, result) {
	console.log(err, result);
});
```

## Contributions
Patches are welcome! Contributors are listed in the package.json file. Please run the tests before opening a pull request and make sure that you are passing all of them. If you would like to contribute, but don't know what to work on, check the issues list or on Rocket Chat https://steem.chat/ channel #steemconnect.

## Issues
When you find issues, please report them!

## License
MIT