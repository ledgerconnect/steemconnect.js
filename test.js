var SteemConnect = require('./lib/steemconnect'),
	steemConnect = new SteemConnect();

var isValid = steemConnect.isValid('ned', '********',
	{
		posting: [["STM7SWWzw9LbzMvvS6WukeXNSqNSZAG5GJbh5u88DT7jGCWdrvgh1", 1]],
		active: [["STM84JpLMeip7X1F1SJNkr2d45tUvavR1LkSJi7NHRTrmhhweyvrb", 1]]
	}
);

console.log(isValid);