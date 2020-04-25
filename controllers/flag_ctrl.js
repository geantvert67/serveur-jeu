const _ = require('lodash'),
    geolib = require('geolib'),
    moment = require('moment'),
    area_ctrl = require('./area_ctrl'),
    team_ctrl = require('./team_ctrl'),
    game_ctrl = require('./game_ctrl'),
    config_ctrl = require('./config_ctrl'),
    interval_ctrl = require('./interval_ctrl'),
    { flag_store } = require('../stores'),
    { getRandomFlagPoint } = require('../utils');

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
                        interval_ctrl.removeFlagIntervalByObjectId(flag.id);
                    } else {
                        currentTeam.score--;
                    }
                }

                if (gameMode === 'TIME') {
                    const interval = setInterval(() => {
                        player && player.score++;
                        newTeam.score++;
                    }, 1000);
                    interval_ctrl.createFlagInterval(interval, flag.id);
                } else {
                    newTeam.score++;
                    player && player.score++;
                }
                flag.team = newTeam;

                if (gameMode === 'SUPREMACY') {
                    if (newTeam.score >= nbFlags / 2) {
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
                interval_ctrl.removeFlagIntervalByObjectId(flagId);
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
                interval_ctrl.removeFlagIntervalByObjectId(id);
            } else {
                flag.team.score--;
            }
        }

        flag_store.remove(id);
    },

    randomize: () => {
        const flags = _this.getAll();

        flags.forEach(
            f =>
                (f.coordinates = getRandomFlagPoint(
                    area_ctrl.getGameArea(),
                    area_ctrl.getForbiddenAreas(),
                    flags,
                    f.id
                ))
        );
    }
});
