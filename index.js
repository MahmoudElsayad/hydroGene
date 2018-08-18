var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = process.env.PORT || 3000;
var word = require('./align.js');
var dp = require('./dp.js');
var hydroGene = require('./hydroGene.js');
var hydroGeneFast = require('./hydrogeneFast.js');
var io = require('socket.io')(server);
var bio = require('bionode-seq');
var ncbi = require('bionode-ncbi');
var JSONStream = require('JSONStream');


server.listen(port, function(){
    console.log("Server started on port : " + port);
});

app.use(express.static(__dirname));

app.get('/', function(request, response){
  response.sendFile(__dirname + '/index.html');
});
app.get('/home', function(request, response){
  response.sendFile(__dirname + '/home.html');
});


io.on('connection', function(socket){
  console.log("User Connected, and it's socket's id is: " + socket.id);

  socket.on('bitwiseOp.message', function(seq){

    var input = seq.split("\n");
    console.log('Received input from client ' + socket.id);
    if (input[0].length < input[1].length) {
      var temp = input[0];
      input[0] = input[1];
      input[1] = temp;
    }
    io.emit('bitwiseOp.result', hydroGene(input[0],input[1]));

    // io.emit('alignment.error', "Error Occured");
    // console.log("Emitted Results to socket "+ socket.id);
  });

  socket.on('bitwise.message', function(seq){

    var input = seq.split("\n");
    console.log('Received input from client ' + socket.id);
    if (input[0].length < input[1].length) {
      var temp = input[0];
      input[0] = input[1];
      input[1] = temp;
    }
    io.emit('bitwise.result', hydroGeneFast(input[0],input[1]));

    // io.emit('alignment.error', "Error Occured");
    // console.log("Emitted Results to socket "+ socket.id);
  });

  socket.on('word.message', function(seq){

    var input = seq.split("\n");
    console.log('Received input from client ' + socket.id);
    if (input[0].length < input[1].length) {
      var temp = input[0];
      input[0] = input[1];
      input[1] = temp;
    }
    console.time('align');
    io.emit('word.result', word.comp(input[0],input[1]));
    console.timeEnd('align');

    // io.emit('alignment.error', "Error Occured");
    // console.log("Emitted Results to socket "+ socket.id);
  });

  socket.on('dp.message', function(seq){

    var input = seq.split("\n");
    console.log('Received input from client ' + socket.id);
    if (input[0].length < input[1].length) {
      var temp = input[0];
      input[0] = input[1];
      input[1] = temp;
    }
    console.time('align');
    io.emit('dp.result', dp.alignment(input[0],input[1]));
    console.timeEnd('align');

    // io.emit('alignment.error', "Error Occured");
    // console.log("Emitted Results to socket "+ socket.id);
  });

  socket.on('checkType.seq', function(seq){
    io.emit('advanced.result', bio.checkType(seq));
  });

  socket.on('translate.seq', function(seq){
    io.emit('advanced.result', bio.translate(seq));
  });

  socket.on('codon.seq', function(seq){
    io.emit('advanced.result', bio.getTranslatedAA(seq));
  });

  socket.on('introns.seq', function(seq, number1 , number2){

    io.emit('advanced.result', bio.removeIntrons(seq , [[number1,number2]]));
  });

  socket.on('navigate.db', function(data){
    console.log('received from client : ' + data);
    var input = data.split(',');
    ncbi.fetch(input[0], input[1]).on('data', function(data){
      io.emit('navigate.result', data);
    });
  });


  socket.on('disconnect', function(){
    console.log("User on socket " + socket.id + " disconnected.");
  });

});
