import express from 'express';
import env from '../config/keys.js';
import { ManagementClient } from 'auth0';
import { checkJwt, checkScopes } from '../utils/authorization.js';
import UserModel from '../models/User.js';
import { handleError, checkForDuplicateUser } from '../utils/helpers/userErrorHandling.js';

const router = express.Router();
const scopeCheck = checkScopes('update:user');

router.put('/:id', async (req, res) => {
	const { id } = req.params;

	const management = new ManagementClient({
		domain: env.auth0Domain,
		clientId: env.auth0ClientId,
		clientSecret: env.auth0ClientSecret
	});

	management.users.get({ id }).then(async (user) => {
		if (await checkForDuplicateUser(id, res))
			return;
		const newUser = new UserModel({
			_id: id,
			pistePreferences: {
				green: true,
				blue: true,
				red: true,
				black: true,
			},
		});
		newUser.save();
		return res.status(200).send('User created');
	}).catch((error) => {
		console.error(error);
		handleError(error, res, id);
		return;
	});
	
});

// Routes
router.patch('/:id', checkJwt, scopeCheck, (req, res) => {
	const { id } = req.params;
	const body = {
		given_name: req.body.given_name,
		family_name: req.body.family_name,
		name: req.body.name
	};

	const management = new ManagementClient({
		domain: env.auth0Domain,
		clientId: env.auth0ClientId,
		clientSecret: env.auth0ClientSecret
	});

	try {
		management.users.update({ id }, body,);
	} catch (error) {
		return res.status(500).send('Error updating user');
	}

	return res.status(200).send('User updated');
});

export default router;