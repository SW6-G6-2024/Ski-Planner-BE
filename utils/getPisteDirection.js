function getPisteDirection(coordinates) {
	const factor = 0.5;

  // Get the first and last points of the piste
  const firstPoint = coordinates[0];
  const lastPoint = coordinates[coordinates.length - 1];

  // Calculate differences in latitude and longitude
  const deltaLon = getDistanceFromLatLonInKm((firstPoint[1]+lastPoint[1])/2, firstPoint[0], (firstPoint[1]+lastPoint[1])/2, lastPoint[0]);
	const deltaLat = getDistanceFromLatLonInKm(firstPoint[1], (firstPoint[0]+lastPoint[0])/2, lastPoint[1], (firstPoint[0]+lastPoint[0])/2);
	
	let direction = '';

  if (Math.abs(deltaLat) > factor * deltaLon) {
    direction += ((lastPoint[1] - firstPoint[1]) > 0 ? 'n' : 's');
  } 
	
	if (Math.abs(deltaLon) > factor * deltaLat) {
    direction += ((lastPoint[0] - firstPoint[0]) > 0 ? 'e' : 'w');
  } 

  return direction;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km

  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

export default getPisteDirection;