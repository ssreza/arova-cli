var moving = false;
var socket = io.connect('http://localhost:3000');
var angle= 1;
socket.on('news', function(data) {
    console.log(data);
    angle= data.position.angle;

});
socket.on('motorMsg', function(data) {
    console.log(data.raw);
});
socket.on('sensor', function(data) {
    console.log("Incoming sensor data:", data.raw);
    $("#inData").append(data.raw + "\r");
    $("#inData").animate({
        scrollTop: $("#inData")[0].scrollHeight - $("#inData").height()
    }, 200);

});

$('.servobtn').button();

$('.servobtn').on('change', function() {
    console.log("Setting Servo Pos:", $('input[name=servo]:checked').val())
    socket.emit('servo', {
        pos: $('input[name=servo]:checked').val()
    });
});

$('#ledSet').on('click', function() {
    var tmp = parseInt($('#ledDelay').val(), 10);
    console.log("Setting LED Delay:", tmp)
    socket.emit('led', {
        delay: tmp
    });
});



$("#right").on('click', function() {

    socket.emit('direction', {
        command: "right"
    });
});

$("#left").on('click', function() {

    socket.emit('direction', {
        command: "left"
    });
});



var speed = 50;

document.addEventListener('keydown', function(event) {

    if (event.keyCode === 87) {

        socket.emit('motor', {
            command: "up"
        });
    }


    if (event.keyCode == 38) {
        if (speed + 31 < 255) {
            speed += 31;
        } else {
            speed = 255;
        }
        socket.emit('motor', {
            command: "speedUp",
            speed
        });
    }
    if (event.keyCode == 40) {
        if (speed - 31 >= 0) {
            speed -= 31;
        } else {
            speed = 0;
        }

        socket.emit('motor', {
            command: "slowDown",
            speed
        });
        console.log('slowing');
    }

    if (event.keyCode == 83) {


        socket.emit('motor', {
            command: "down"
        });
        moving = true;
        console.log('back');
    }

    if (event.keyCode == 65) {
         if (angle>-5) {
            socket.emit('direction', {
                command: "left"
            }); 
            angle-=1;
        }


    }

    if (event.keyCode == 68) {
        if (angle<5) {
            socket.emit('direction', {
                command: "right"
            }); 
            angle++;
        }
    }

    if (event.keyCode == 32) {

        socket.emit('motor', {
            command: "brake"
        });


        console.log('space was pressed');

    }

});


document.addEventListener('keyup', function(event) {
    console.log(event.keyCode);
    if (event.keyCode === 87) {
        socket.emit('motor', {
            command: 'brake'
        });
    }

    if (event.keyCode == 83) {


        socket.emit('motor', {
            command: "brake"
        });

    }
});


