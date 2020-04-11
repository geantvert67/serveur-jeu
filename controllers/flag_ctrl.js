const _ = require('lodash'),
    geolib = require('geolib'),
    moment = require('moment'),
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

    getInRadius: (coordinates, radius, inActionRadius = []) => {
        return _this.getAll().filter(
            f =>
                !_.some(_this.getCaptured(), f) &&
                !_.some(inActionRadius, f) &&
                geolib.isPointWithinRadius(
                    {
                        latitude: coordinates[0],
                        longitude: coordinates[1]
                    },
                    {
                        latitude: f.coordinates[0],
                        longitude: f.coordinates[1]
                    },
                    radius
                )
        );
    },

    captureFlag: (flagId, teamId, player) => {
        const flag = _this.getById(flagId),
            { flagCaptureDuration } = config_ctrl.get();

        if (
            (flag.capturedUntil &&
                moment().isSameOrAfter(flag.capturedUntil)) ||
            !flag.capturedUntil
        ) {
            if (!flag.team || (flag.team && flag.team.id !== teamId)) {
                const newTeam = team_ctrl.getById(teamId);

                if (flag.team) {
                    const currentTeam = team_ctrl.getById(flag.team.id);
                    currentTeam.nbFlags--;
                }

                newTeam.nbFlags++;
                flag.team = newTeam;
                player && player.nbCapturedFlags++;
                flag.capturedUntil = moment().add(flagCaptureDuration, 's');
                setTimeout(() => {
                    flag.capturedUntil = null;
                }, flagCaptureDuration * 1000);
            }
        }
    },

    resetFlag: flagId => {
        const flag = _this.getById(flagId);

        if (flag.team) {
            const currentTeam = team_ctrl.getById(flag.team.id);
            currentTeam.nbFlags--;
        }

        flag.team = null;
        flag.capturedUntil = null;
    },

    moveFlag: (coordinates, flagId) => {
        _this.getById(flagId).coordinates = coordinates;
    },

    delete: id => {
        const flag = _this.getById(id);

        if (flag.team) {
            team_ctrl.getById(flag.team.id).nbFlags--;
        }

        flag_store.remove(id);
    }
});
