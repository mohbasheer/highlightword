var express = require('express');
var app = express();

// app.use(express.static(__dirname));
// app.use('/bower_components',express.static(__dirname))
//app.use(express.static(__dirname + '/bower_components/'))

app.use(express.static(__dirname + ''));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// app.get('/',function(req, res){
// 	console.log(__dirname);
// });

// app.get('/controller.js',function(req, res){
// 	res.sendFile(__dirname + '/controller.js');
// });

app.listen(3000, function(){
	console.log('server started at port 3000');
});