const fs = require('fs');

module.exports = (io, socket, player) => {
    fs.readdirSync(__dirname)
        .filter(filename => filename !== 'index.js')
        .forEach(filename => {
            require('./' + filename)(io, socket, player);
        });
};
