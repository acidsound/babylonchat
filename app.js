
/**
 * Module dependencies.
 */

var express = require('express'),
    sys = require('sys'),
		io = require('socket.io');
var app = module.exports = express.createServer();

var rcount=0;
// Configuration
var port=4000;

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.send("http://xx/[별명]으로 들어오세요");
});

app.get('/:user', function(req, res) {
  res.render('index', {
    title: req.params.user+"님의 똥찌꺼기",
    user : req.params.user,
    listenPort: port
  });
  console.log(req.params.user+" entered");
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(port);
  console.log("Express server listening on port %d", app.address().port);
}

// simplest chat
var io = io.listen(app),
    buffer = [];
io.on('connection', function(client){
  client.send({ buffer: buffer });
  client.broadcast({ announcement: client.sessionId + ' connected' });
  
  client.on('message', function(message){
    var msg = { message: [client.sessionId, message] };
    buffer.push(msg);
    if (buffer.length > 15) buffer.shift();
    client.broadcast(msg);
  });

  client.on('disconnect', function(){
    client.broadcast({ announcement: client.sessionId + ' disconnected' });
  });
});
