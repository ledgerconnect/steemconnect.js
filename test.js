/* eslint-disable */

const steemConnect = require('./index');

steemConnect.isAuthenticated((err, result) => {
  console.log(err, result);
});
