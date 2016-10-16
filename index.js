
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

  socket.emit('motor',{command:"up", speed:20});
});


$("#down").on('click', function(){
  moving = true ;

  socket.emit('motor',{command:"down", speed:20});
});

$("#right").on('click', function(){

  socket.emit('direction',{command:"right"});
});

$("#left").on('click', function(){

  socket.emit('direction',{command:"left"});
});
$("#brake").on('click', function(){
  
  socket.emit('motor',{command:"brake"});
});


var speed = 20;
document.addEventListener('keydown', function(event) {

  if(event.keyCode == 87) {
        
        socket.emit('motor',{command:"up",speed });
    }


    if(event.keyCode == 38 && moving ===true) {
        if(speed+31 < 255)
          {speed+=31;}
        else  {
          speed = 255;
        }
        socket.emit('motor',{command:"speedUp",speed });
    }
     if(event.keyCode == 40 && moving ===true) {
      if(speed-31 >= 0)
          {speed-=31;}else{
            speed = 0;
          }

        socket.emit('motor',{command:"slowDown",speed });
        console.log('slowing');
    }

    if(event.keyCode == 83 ) {
      if(speed+31 < 255)
          {speed+=31;}
        else  {
          speed = 255;
        }

        socket.emit('motor',{command:"down",speed });
        moving = true;
        console.log('slowing');
    }

    if(event.keyCode == 32 && moving ===true) {
        moving= false;
        socket.emit('motor',{command:"brake"});
        console.log('Down was pressed');
        $('#brake').text("Resume");

    }

});