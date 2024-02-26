import err from "./errorCodes";
import mongoose from 'mongoose';

/**
 * Checks if the parameters are valid
 * @param {Array<Object>} params - Array of objects containing the parameters to be checked
 * @param {String} params.name - The name of the parameter
 * @param {Object} params.value - The value to be checked
 * @param {Boolean} params.id - (Optional) Whether the parameter is an id
 * @param {Function} params.func - (Optional) The function to be used to check the parameter
 * @param {Object} params.funcErr - (Optional) The error to be sent if the parameter is invalid
 * @param {Object} res - Express response object
 */
export default (params, res) => {
	for (const param of params) {
		if (!param.value)
			return res.status(400).send(err.general.missingParam(param.name));
		if (param.id && !mongoose.Types.ObjectId.isValid(param.value))
			return res.status(400).send(err.general.invalidId(param.name));
		if (param.func && !param.func(param.value))
			return res.status(400).send(param.funcErr);
	}
};