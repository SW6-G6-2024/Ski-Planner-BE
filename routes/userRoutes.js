import express from 'express';
import env from '../config/keys.js';
import { ManagementClient } from 'auth0';
import { checkJwt, checkScopes, checkUser } from '../utils/authorization.js';
import UserModel from '../models/User.js';
import { handleError } from '../utils/helpers/userErrorHandling.js';
import { updateAuth0User } from '../utils/helpers/updateAuth0User.js';
import { getUser, patchUserPreferences } from '../controllers/userControllers.js';

const router = express.Router();

router.get('/:id', checkJwt, checkScopes('read:current_user'), checkUser, getUser);

router.put('/:id',
	/**
	 * Create a new user in the database with the given id
	 * @param {Express.Request} req 
	 * @param {Express.Response} res 
	 */
	async (req, res) => {
		const { id } = req.params;

		const management = new ManagementClient({
			domain: env.auth0Domain,
			clientId: env.auth0ClientId,
			clientSecret: env.auth0ClientSecret
		});

		management.users.get({ id }).then(async (user) => {
			UserModel.findByIdAndUpdate(id, {}, { upsert: true, new: true, setDefaultsOnInsert: true })
				.then(() => {
					console.log('User created/updated');
					return res.status(200).send('User created');
				}).catch((error) => {
					console.error(error);
					return res.status(500).send('Error creating user');
				})
		}).catch((error) => {
			handleError(error, res, id);
			return;
		});

	});

// Routes
router.patch('/:id', checkJwt, checkScopes('update:user'), checkUser,
	/**
	 * Update an existing user in the database
	 * @param {Express.Request} req
	 * @param {Express.Response} res 
	 * @returns 
	 */
	async (req, res) => {
		const { id } = req.params;
		const body = {
			given_name: req.body.given_name,
			family_name: req.body.family_name,
			name: req.body.name
		};

		if (await updateAuth0User(id, body, res))
			return;

		return res.status(200).send('User updated');
	});

router.patch('/:id/preferences', checkJwt, checkScopes('update:preferences'), checkUser, patchUserPreferences);

export default router;