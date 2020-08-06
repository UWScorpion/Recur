var express = require('express');
var path = require('path');
var app = express();

const SERVER_PORT = process.argv.slice(2)[0] || 8079;

app.use(express.static('public'));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(SERVER_PORT, () => {});
