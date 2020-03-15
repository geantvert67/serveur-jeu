const { flag_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('captureFlag', ({ flagId, teamId }) => {
        flag_ctrl.captureFlag(flagId, teamId);
    });
};
