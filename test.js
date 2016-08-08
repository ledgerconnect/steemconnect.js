var SteemConnect = require('./lib/steemconnect'),
	steemConnect = new SteemConnect();

var isValid = steemConnect.isValid('ned', '****************',
	{
		posting: [["STM7H7yZfed2GqkgdLuYy3VVrmQLV4htbiu1WGouRHsjjD4Kq1MvQ", 1]],
		active: [["STM7sw22HqsXbz7D2CmJfmMwt9rimtk518dRzsR1f8Cgw52dQR1pR", 1]]
	}
);

console.log(isValid);