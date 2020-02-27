const server = require('http').createServer(),
    io = require('socket.io')(server);

server.listen(8080, () => console.log('Serveur lancée sur le port 8080'));
