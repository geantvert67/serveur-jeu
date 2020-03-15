const _ = require('lodash'),
    add = require('date-fns/add'),
    isPast = require('date-fns/isPast'),
    team_ctrl = require('./team_ctrl'),
    config_ctrl = require('./config_ctrl'),
    { flag_store } = require('../stores');

const _this = (module.exports = {
    getAll: () => {
        return flag_store.getAll();
    },

    getCaptured: () => {
        return _.filter(_this.getAll(), f => f.team !== null);
    },

    getById: id => {
        return _.find(_this.getAll(), { id });
    },

    captureFlag: (flagId, teamId) => {
        const flag = _this.getById(flagId),
            { flagCaptureDuration } = config_ctrl.get();

        if (
            (flag.capturedUntil && isPast(flag.capturedUntil)) ||
            !flag.capturedUntil
        ) {
            flag.team = team_ctrl.getById(teamId);
            flag.capturedUntil = add(new Date(Date.now()), {
                seconds: flagCaptureDuration
            });
            setTimeout(() => {
                flag.capturedUntil = null;
            }, flagCaptureDuration * 1000);
        }
    }
});
