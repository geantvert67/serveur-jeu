const geolib = require('geolib');

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
                .includes(true)
        ) {
            return _this.getRandomPoint(gameArea, forbiddenAreas);
        }

        return point;
    }
});
