
/**
 * Calculate the effect of the wind on the skiing conditions
 * @param {*} windDir 
 * @param {*} pisteDir 
 * @returns 
 */
function calculateWindEffect(windDir, pisteDir) {
	
  const windDirection = (windDir + 360) % 360;
	const pisteDirection = (pisteDir + 360) % 360;

	let diff = Math.abs(windDirection - pisteDirection);

	diff = Math.min(diff, 360 - diff);

	return (diff / 180);
}

export default calculateWindEffect;