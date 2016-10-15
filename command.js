var Cylon = require('cylon');

Cylon.robot({
  name:'arova',
  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
  },

  devices: {
    led: { driver: 'led', pin: 13 },
    button: { driver: 'button', pin: 2 },
    motor: { driver: 'motor', pin: 3 }
  },

  work: function(my) {
    my.motor.on("handle", function(){
      console.log("handle");
    });
  }
});

Cylon.api('socketio',
{
  host: '0.0.0.0',
  port: '3000'
});

Cylon.start();