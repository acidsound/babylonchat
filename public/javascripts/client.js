var listenport = 4000;
var socket = new io.Socket(null, {port: listenport, rememberTransport: false});

function message(obj){
    var el = document.createElement('p');
    if ('announcement' in obj) el.innerHTML = '<em>' + esc(obj.announcement) + '</em>';
    else if ('message' in obj) el.innerHTML = '<b>' + esc(obj.message[0]) + ':</b> ' + esc(obj.message[1]);
    
    if( obj.message && window.console && console.log ) console.log(obj.message[0], obj.message[1]);
    $("#chat").prepend(el);
    document.getElementById('chat').scrollTop = 1000000;
}

function send(){
    var val = $("#text").val();
    socket.send(val);
    message({ message: ['<%=user%>', val] });
    $("#text").val("");
    return false;
}

function esc(msg){
    return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

$(document).ready(function() {
socket.connect();
socket.on('message', function(obj){
    if ('buffer' in obj){
      
      $("#form").css("display", "block");
      $("#chat").html("");
      
      for (var i in obj.buffer) message(obj.buffer[i]);
    } else message(obj);
});

$("#form").bind('submit', send());

socket.on('connect', function(){ message({ message: ['System', 'Connected', user]})});
socket.on('disconnect', function(){ message({ message: ['System', 'Disconnected']})});
socket.on('reconnect', function(){ message({ message: ['System', 'Reconnected to server']})});
socket.on('reconnecting', function( nextRetry ){ message({ message: ['System', 'Attempting to re-connect to the server, next attempt in ' + nextRetry + 'ms']})});
socket.on('reconnect_failed', function(){ message({ message: ['System', 'Reconnected to server FAILED.']})});
});

