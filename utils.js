const geolib = require('geolib'),
    config_ctrl = require('./controllers/config_ctrl');

const _this = (module.exports = {
    /**
     * Renvoie un point situé aléatoirement dans la zone de jeu et qui n'est pas
     * dans une zone interdite
     *
     * @param object gameArea Zone de jeu
     * @param array forbiddenAreas Liste des zones interdites
     */
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

    /**
     * Renvoie un point situé aléatoirement dans la zone de jeu, qui n'est pas
     * dans une zone interdite et qui ne rentre pas en conflit avec le rayon d'un
     * cristal
     *
     * @param object gameArea Zone de jeu
     * @param array forbiddenAreas Liste des zones interdites
     * @param array flags Liste des cristaux
     * @param int iterations Nombre de fois où cette fonction a été appelée récusivement
     * @param int maxIterations Niveau de récursivité maximum
     */
    getRandomFlagPoint: (
        gameArea,
        forbiddenAreas,
        flags,
        iterations = 0,
        maxIterations = null
    ) => {
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
            _this.isFlagInConflict(point, flags, flagVisibilityRadius)
        ) {
            return maxIterations && iterations >= maxIterations
                ? null
                : _this.getRandomFlagPoint(
                      gameArea,
                      forbiddenAreas,
                      flags,
                      iterations + 1,
                      maxIterations
                  );
        }

        return point;
    },

    /**
     * Renvoie vrai si le point en conflit avec le rayon d'un cristal, faux sinon
     *
     * @param array coordinates Point
     * @param array flags Liste des cristaux
     * @param float radius Rayon des cristaux
     */
    isFlagInConflict: (coordinates, flags, radius) => {
        let conflict = false;
        flags.forEach(f => {
            _this.getDistance(coordinates, f.coordinates) < radius * 2 &&
                (conflict = true);
        });

        return conflict;
    },

    /**
     * Convertit un angle en Celsius en radians
     *
     * @param int degree L'angle à convertir
     */
    toRadian: degree => {
        return (degree * Math.PI) / 180;
    },

    /**
     * Renvoie la distance entre 2 points
     *
     * @param array origin Point de départ
     * @param array destination Point d'arrivée
     */
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

    /**
     * Renvoie un rayon après avoir appliqué un impact en pourcentage dessus
     *
     * @param float radius Rayon de départ
     * @param int radiusChange Impact sur le rayon
     */
    calculateRadius: (radius, radiusChange) => {
        let r = radius;
        radiusChange.forEach(o => (r += (o.percent / 100) * r));
        return r;
    }
});
