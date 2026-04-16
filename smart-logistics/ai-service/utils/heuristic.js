function getDistance(pos1, pos2) {
    const R = 6371; // km
    const dLat = (pos2[0] - pos1[0]) * Math.PI / 180;
    const dLon = (pos2[1] - pos1[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(pos1[0] * Math.PI / 180) * Math.cos(pos2[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function calculateMatchScore(pack, vehicle) {
    const distanceScore = 100 - (getDistance(vehicle.pos, pack.pos) * 2);

    const capacityScore = ((vehicle.capacity - vehicle.load) >= (pack.weight || 10)) ? 50 : -500;
    return distanceScore + capacityScore;
}

module.exports = { getDistance, calculateMatchScore };
