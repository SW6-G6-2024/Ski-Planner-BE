import err from "../errorCodes.js"
import UserModel from "../../models/User.js";

function handleError(error, res, id) {
	switch (error.errorCode) {
		case "invalid_uri":
			return res.status(400).send(err.userCreation.invalidId(id));
		case "inexistent_user":
			return res.status(400).send(err.userCreation.invalidUser);
	}
}

async function checkForDuplicateUser(id, res) {
	const user = await UserModel.findById(id);
	if (user) {
		return res.status(400).send(err.userCreation.duplicateUser);
	}
}

export { handleError, checkForDuplicateUser };