// initialize everything, web server, socket.io, filesystem, johnny-five
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , five = require("johnny-five"),
  board,servo,led,sensor, motor, direction, position;
 

   var fs = require("fs");

function readJson(){
   var contents = fs.readFileSync("position.json");
// Define to JSON type
  position = JSON.parse(contents);
}

function writeJson(){
  var str = JSON.stringify(position);
  fs.writeFile('position.json', str, function (err) {
    if (err) return console.log(err);
    console.log(str + ' > position.json');
  });
}

readJson();
board = new five.Board();

// on board ready
board.on("ready", function() {

  // init a led on pin 13, strobe every 1000ms
  led = new five.Led(13).strobe(1000);

  motor = new five.Motor({
    pins: {
      pwm: 3,
      dir: 12,
      brake: 9
    }
  });

   direction = new five.Motor({
    pins: {
      pwm: 5,
      dir: 8,
      brake: 10
    }
  });
 
  // setup a stanard servo, center at start
  servo = new five.Servo({
    pin:6,
    range: [0,180],
    type: "standard",
    center:true
  });

  // poll this sensor every second
  sensor = new five.Sensor({
    pin: "A0",
    freq: 1000
  });

});

// make web server listen on port 80
app.listen(3000);


// handle web server
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}


// on a socket connection
io.sockets.on('connection', function (socket) {
 
 
  // if board is ready
  if(board.isReady){
    // read in sensor data, pass to browser
     socket.emit('news', { message: 'board is ready', position:position });
    sensor.on("data",function(){

      socket.emit('sensor', { raw: this.raw });
    });
  }

  // if servo message received
  socket.on('servo', function (data) {
    console.log(data);
    if(board.isReady){ servo.to(data.pos);  }
  });
  // if led message received
  socket.on('led', function (data) {
    console.log(data);
     if(board.isReady){    led.strobe(data.delay); } 
  });
var count =0;  


 socket.on('direction', function(data){
  if (data.command) {
    if (data.command === 'left') {
      if(board.isReady){    
        
         var left= setInterval(function(){
                    direction.forward(255);
                    
                 }, 50); 
          setTimeout(function(){
            clearInterval(left);
            position.angle += 500;
            writeJson(position);
          }, 1000 - position.angle);
       
      } 

    }
   if (data.command === 'brake') {
         if(board.isReady){    motor.brake(); } 

        }
    if (data.command === 'right') {
      if(board.isReady){   
        var right= setInterval(function(){
                    direction.reverse(255);
                    
                 }, 50); 
        setTimeout(function() {
          clearInterval(right)
          position.angle -= 500;
            writeJson(position);
        }, 1000 + position.angle);
      } 

    }
  }
  data.position = position;
  socket.emit('motorMsg', { raw: data });
 });
 socket.on('motor', function (data) {
    //if(board.isReady){ motor.to(data.pos);  }
    if (data.command ) {
      var speed = data.speed || 20;
      if (data.command === 'up') {
       if(board.isReady){    motor.forward(speed); } 

      }

       if (data.command === 'down') {
       if(board.isReady){    

        motor.reverse(speed); 
      } 

      }

      if (data.command === 'brake') {
       if(board.isReady){    motor.brake(); motor.stop() } 

      }

      if (data.command === 'resume') {
             if(board.isReady){    motor.release(); } 

            }
      if (data.command === 'speedUp'){
               if(board.isReady){    motor.start(speed); } 

      }

    }
    socket.emit('motorMsg', { raw: data });
  });
});