const geolib = require('geolib'),
    config_ctrl = require('./controllers/config_ctrl');

const _this = (module.exports = {
    getRandomPoint: (gameArea, forbiddenAreas) => {
        const { maxLat, minLat, maxLng, minLng } = geolib.getBounds(
            gameArea.coordinates[0]
        );
        const x = minLng + Math.random() * (maxLng - minLng);
        const y = minLat + Math.random() * (maxLat - minLat);
        const point = [x, y];

        if (
            forbiddenAreas
                .map(a => geolib.isPointInPolygon(point, a.coordinates[0]))
                .includes(true) ||
            !geolib.isPointInPolygon(point, gameArea.coordinates[0])
        ) {
            return _this.getRandomPoint(gameArea, forbiddenAreas);
        }

        return point;
    },

    getRandomFlagPoint: (gameArea, forbiddenAreas, flags, flagId) => {
        const { flagVisibilityRadius } = config_ctrl.get();
        const { maxLat, minLat, maxLng, minLng } = geolib.getBounds(
            gameArea.coordinates[0]
        );
        const x = minLng + Math.random() * (maxLng - minLng);
        const y = minLat + Math.random() * (maxLat - minLat);
        const point = [x, y];

        if (
            forbiddenAreas
                .map(a => geolib.isPointInPolygon(point, a.coordinates[0]))
                .includes(true) ||
            !geolib.isPointInPolygon(point, gameArea.coordinates[0]) ||
            _this.isFlagInConflict(
                point,
                flags.filter(f => f.id !== flagId),
                flagVisibilityRadius
            )
        ) {
            return _this.getRandomFlagPoint(
                gameArea,
                forbiddenAreas,
                flags,
                flagId
            );
        }

        return point;
    },

    isFlagInConflict: (coordinates, flags, radius) => {
        let conflict = false;
        flags.forEach(f => {
            _this.getDistance(coordinates, f.coordinates) < radius * 2 &&
                (conflict = true);
        });

        return conflict;
    },

    toRadian: degree => {
        return (degree * Math.PI) / 180;
    },

    getDistance: (origin, destination) => {
        let lon1 = _this.toRadian(origin[1]),
            lat1 = _this.toRadian(origin[0]),
            lon2 = _this.toRadian(destination[1]),
            lat2 = _this.toRadian(destination[0]);

        let deltaLat = lat2 - lat1;
        let deltaLon = lon2 - lon1;

        let a =
            Math.pow(Math.sin(deltaLat / 2), 2) +
            Math.cos(lat1) *
                Math.cos(lat2) *
                Math.pow(Math.sin(deltaLon / 2), 2);
        let c = 2 * Math.asin(Math.sqrt(a));
        let EARTH_RADIUS = 6371;
        return c * EARTH_RADIUS * 1000;
    },

    calculateRadius: (radius, radiusChange) => {
        let r = radius;
        radiusChange.forEach(o => (r += (o.percent / 100) * r));
        return r;
    }
});
