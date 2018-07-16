var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: 'MNUWEa1NnwR7c2EbxnnCiLe1L',
  consumer_secret: 'OPUrK9xq8iykRcupakaWZ2nrhX2yAzHqVo5VJBFkFZLmEv0qkG',
  access_token_key: '34663418-Frxua7872rhu5dg0NcXRSf5kqdU0f1eCvkUOnGMjC',
  access_token_secret: '8AJHZHPg98qlHN80rkpJnlwtgG4nPTRWFoasWAUXrN2Og'
});
 
var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});