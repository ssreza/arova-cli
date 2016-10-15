// initialize everything, web server, socket.io, filesystem, johnny-five
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , five = require("johnny-five"),
  board,servo,led,sensor, motor;

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

  // motor.on("forward", function(err, timestamp) {
  //   // demonstrate braking after 5 seconds
  //   board.wait(5000, function() {
  //     motor.brake();
  //   });
  // });

   motor.on("brake", function(err, timestamp) {
    // Release the brake after .1 seconds
    board.wait(100, function() {
      motor.stop();
    });
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
     socket.emit('news', { message: 'board is ready' });
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
 socket.on('motor', function (data) {
    //if(board.isReady){ motor.to(data.pos);  }
    if (data.command ) {
      var speed = data.speed || 128;
      if (data.command === 'up') {
       if(board.isReady){    motor.forward(speed); } 

      }

      if (data.command === 'brake') {
       if(board.isReady){    motor.brake(); } 

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