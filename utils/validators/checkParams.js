import err from "../errorCodes.js";
import mongoose from 'mongoose';

/**
 * Checks if the parameters are valid
 * @param {Array<Param>} params - Array of objects containing the parameters to be checked
 * @param {Express.Response} res - Express response object
 */
export default (params, res) => {
	for (const param of params) {
		if (param.value === undefined || param.value === null || param.value === "") {
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