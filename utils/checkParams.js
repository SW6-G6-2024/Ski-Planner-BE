import err from "./errorCodes.js";
import mongoose from 'mongoose';

/**
 * Checks if the parameters are valid
 * @param {Array<param>} params - Array of objects containing the parameters to be checked
 * @param {Express.Response} res - Express response object
 */
export default (params, res) => {
	for (const param of params) {
		if (!param.value) {
			return res.status(400).send(err.general.missingParam(param.name));
		}
		if (param.id && !mongoose.Types.ObjectId.isValid(param.value)) {
			return res.status(400).send(err.general.invalidId(param.name));
		}
		if (param.func && !param.func(param.value)) {
			return res.status(400).send(param.funcErr);
		}
	}

	return;
};

/**
 * @typedef {Object} param
 * @property {String} name - The name of the parameter
 * @property {Object} value - The value to be checked
 * @property {Boolean} id - (Optional) Whether the parameter is an id
 * @property {Function} func - (Optional) The function to be used to check the parameter
 * @property {Object} funcErr - (Optional) The error to be sent if the parameter is invalid
 */