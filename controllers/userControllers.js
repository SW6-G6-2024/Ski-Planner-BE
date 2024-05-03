import UserModel from '../models/User.js';

async function getUser(req, res) {
	const { id } = req.params;

	try {
		const user = await UserModel.findById(id);
		if (!user) {
			return res.status(404).send('User not found');
		}
		return res.status(200).send(user);
	} catch (err) {
		return res.status(500).send('Error getting user');
	}
}

/**
	* Update the preferences of an existing user in the database
	* @param {Express.Request} req 
	* @param {Express.Response} res 
	* @returns 
	*/
async function patchUserPreferences(req, res) {
	const test = req.headers.test;
	const { id } = req.params;
	let body = filterBody(req.body);

	let updatedUser;

	try {
		const user = await UserModel.findById(id);
		if (!user) {
			return res.status(404).send('User not found');
		}

		const updatedPreferences = makeUpdateObject(body, user.preferences);
		
		updatedUser = await UserModel.findByIdAndUpdate(id, { preferences: updatedPreferences }, { new: true, disablePrint: test });
	} catch (error) {
		console.error(error);
		return res.status(500).send('Error updating user preferences');
	}

	return res.status(200).send({
		message: 'User preferences updated successfully',
		user: updatedUser
	});
}

/**
 * Filter the body of the express request to only include the allowed prefrence fields
 * @param {Object} body The body of the express request
 * @returns {FilteredBody} The filtered body
 */
function filterBody(body) {
	body = {
		pisteDifficulties: body.pisteDifficulties,
		liftTypes: body.liftTypes
	}

	body.pisteDifficulties = body.pisteDifficulties && {
		green: body.pisteDifficulties.green,
		blue: body.pisteDifficulties.blue,
		red: body.pisteDifficulties.red,
		black: body.pisteDifficulties.black
	}

	body.liftTypes = body.liftTypes && {
		gondola: body.liftTypes.gondola,
		chair: body.liftTypes.chair,
		tBar: body.liftTypes.tBar,
		platter: body.liftTypes.platter
	}
	return body;
}

/**
 * Update the preferences of the user with the desired preferences
 * @param {FilteredBody} body The filtered body of the express request with the desired preferences
 * @param {*} current The current preferences of the user
 * @returns {FilteredBody} The updated preferences
 */
function makeUpdateObject(body, current) {
	let res = current;

	for (const outerField in body) {
		if(body[outerField] === undefined) continue;
		res[outerField] = updateFields(body[outerField], res[outerField]);
	}
	
	return res;
}

/**
 * Update the fields of the current preferences with the desired updates
 * @param {Object} field The desired updates of preferences
 * @param {*} current The current field to update with the desired updates
 * @returns {Object} The updated field
 */
function updateFields(field, current) {
	let res = current;
	for (const innerField in field) {
		if(field[innerField] === undefined) continue;
		res[innerField] = field[innerField];
	}
	return res;
}

export { getUser, patchUserPreferences };