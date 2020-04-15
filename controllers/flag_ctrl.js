const _ = require('lodash'),
    geolib = require('geolib'),
    moment = require('moment'),
    team_ctrl = require('./team_ctrl'),
    game_ctrl = require('./game_ctrl'),
    config_ctrl = require('./config_ctrl'),
    interval_ctrl = require('./interval_ctrl'),
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

    captureFlag: (io, flagId, teamId, player) => {
        const nbFlags = _this.getAll().length,
            flag = _this.getById(flagId),
            { flagCaptureDuration, gameMode } = config_ctrl.get();

        if (
            (flag.capturedUntil &&
                moment().isSameOrAfter(flag.capturedUntil)) ||
            !flag.capturedUntil ||
            !player
        ) {
            if (!flag.team || (flag.team && flag.team.id !== teamId)) {
                const newTeam = team_ctrl.getById(teamId);

                if (flag.team) {
                    const currentTeam = team_ctrl.getById(flag.team.id);
                    if (gameMode === 'TIME') {
                        interval_ctrl.removeByObjectId(flag.id);
                    } else {
                        currentTeam.score--;
                    }
                }

                if (gameMode === 'TIME') {
                    const interval = setInterval(() => newTeam.score++, 1000);
                    interval_ctrl.create(interval, flag.id);
                } else {
                    newTeam.score++;
                }
                flag.team = newTeam;
                player && player.nbCapturedFlags++;

                if (gameMode === 'SUPREMACY') {
                    if (newTeam.nbFlags >= nbFlags / 2) {
                        game_ctrl.end(io);
                    }
                }

                flag.capturedUntil = moment().add(flagCaptureDuration, 's');
                setTimeout(() => {
                    flag.capturedUntil = null;
                }, flagCaptureDuration * 1000);
            }
        }
    },

    resetFlag: flagId => {
        const flag = _this.getById(flagId),
            { gameMode } = config_ctrl.get();

        if (flag.team) {
            const currentTeam = team_ctrl.getById(flag.team.id);
            if (gameMode === 'TIME') {
                interval_ctrl.removeByObjectId(flagId);
            } else {
                currentTeam.score--;
            }
        }

        flag.team = null;
        flag.capturedUntil = null;
    },

    moveFlag: (coordinates, flagId) => {
        _this.getById(flagId).coordinates = coordinates;
    },

    delete: id => {
        const flag = _this.getById(id),
            { gameMode } = config_ctrl.get();

        if (flag.team) {
            if (gameMode === 'TIME') {
                interval_ctrl.removeByObjectId(id);
            } else {
                flag.team.score--;
            }
        }

        flag_store.remove(id);
    }
});
