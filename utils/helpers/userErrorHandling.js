import err from "../errorCodes.js"

function handleError(error, res, id) {
	switch (error.errorCode) {
		case "invalid_uri":
			return res.status(400).send(err.userCreation.invalidId(id));
		case "inexistent_user":
			return res.status(400).send(err.userCreation.invalidUser);
	}
}

export { handleError };