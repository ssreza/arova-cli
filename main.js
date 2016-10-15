 var led;
var motor ;
window.onload = function() {
  console.log('Setting up socket connections:');

  // We use the robot nsp (namespace) to connect to one of the devices
  // in this case the led we added in our cylon robot code
  led = io('http://127.0.0.1:3000/api/robots/arova/devices/led');
  led.emit('toggle');

  led.on('message', function(payload) {
    console.log('On Device');
    console.log(payload)
    console.log('  Event:', payload.event);
    console.log('  Data:', payload.data);
    $('#messages').append($('<li>').text('On Device:'));
    $('#messages').append($('<li>').text('  Event:' + payload.event.toString()));
    if (!!payload.data) {
      $('#messages').append($('<li>').text('  Data:' + payload.data.toString()));
    }
    $('#messages').append($('<hr />'));
  });

  msg = 'You have been subscribed to Cylon sockets:' + led.nsp;

  $('#messages').append($('<li>').text(msg));
  motor = io('http://127.0.0.1:3000/api/robots/arova/devices/motor');
  motor.emit("handle");

};