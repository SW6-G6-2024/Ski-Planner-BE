function getPisteDirection(coordinates) {
	const factor = 0.5;

  // Get the first and last points of the piste
  const firstPoint = coordinates[0];
  const lastPoint = coordinates[coordinates.length - 1];

  const pisteAngle = angle(firstPoint[0], firstPoint[1], lastPoint[0], lastPoint[1]);

  return pisteAngle;
}

function angle(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta = (theta + 360) % 360; // range [0, 360)
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

getPisteDirection([ [ 12.1272371, 61.2956077 ], [ 12.2668695, 61.3324028 ] ]);

export default getPisteDirection;