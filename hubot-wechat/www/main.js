var express = require('express');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

// respond with "hello world" when a GET request is made to the homepage
app.get('/helloworld', function (req, res) {
  res.send('hello world');
});

app.listen(11611, function () {
  console.log('app listening on port 11611!')
})