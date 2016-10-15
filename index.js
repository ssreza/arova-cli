
var moving = false;
var socket = io.connect('http://localhost:3000');
socket.on('news', function (data) {
  console.log(data);
});
socket.on('motorMsg', function (data) {
  console.log(data.raw);
});
socket.on('sensor', function (data) {
  console.log("Incoming sensor data:",data.raw);
  $("#inData").append(data.raw+"\r");
  $("#inData").animate({scrollTop:$("#inData")[0].scrollHeight - $("#inData").height()},200);

});

$('.servobtn').button();

$('.servobtn').on('change',function(){
    console.log("Setting Servo Pos:",$('input[name=servo]:checked').val())
    socket.emit('servo',{pos:$('input[name=servo]:checked').val()});
});

$('#ledSet').on('click',function(){
  var tmp = parseInt($('#ledDelay').val(),10);
  console.log("Setting LED Delay:",tmp)
  socket.emit('led',{delay:tmp});
});

$("#up").on('click', function(){
  moving = true ;

  socket.emit('motor',{command:"up", speed:120});
});

$("#brake").on('click', function(){
 
  if($(this).text() === 'Stop'){
     moving = false;
      $(this).text("Resume");
      socket.emit('motor',{command:"brake"});

    }else if($(this).text() === 'Resume'){
      $(this).text("Stop");
      socket.emit('motor',{command:"resume"});
    }
});

var speed = 128;
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 38 && moving ===true) {
        if(speed+31 < 255)
          {speed+=31;}
        else  {
          speed = 255;
        }
        socket.emit('motor',{command:"speedUp",speed });
    }
    else if(event.keyCode == 40 && moving ===true) {
      if(speed-31 >= 0)
          {speed-=31;}else{
            speed = 0;
          }

        socket.emit('motor',{command:"slowDown",speed });
        console.log('slowing');
    }

    else if(event.keyCode == 40 && moving ===true) {
      if(speed-31 >= 0)
          {speed-=31;}else{
            speed = 0;
          }

        socket.emit('motor',{command:"slowDown",speed });
        console.log('Down was pressed');
    }
});