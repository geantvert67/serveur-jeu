const server = require('http').createServer(),
    io = require('socket.io')(server),
    import_ctrl = require('./controllers/import_ctrl');

import_ctrl.import_config();

server.listen(8080, () => console.log('Serveur lancée sur le port 8080'));
