import express from 'express';
import { checkJwt, checkScopes, checkUser } from '../utils/authorization.js';
import { addUser, getUser, patchUserPreferences, updateAuth0User } from '../controllers/userControllers.js';

const router = express.Router();

// istanbul ignore next
router.get('/:id', checkJwt, checkScopes('read:current_user'), checkUser, getUser);

// istanbul ignore next
router.put('/:id',
	/**
	 * Create a new user in the database with the given id
	 * @param {Express.Request} req 
	 * @param {Express.Response} res 
	 */
	async (req, res) => {
		const { id } = req.params;

		return addUser(id, res);
	});

// Routes
// istanbul ignore next
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

// istanbul ignore next
router.patch('/:id/preferences', checkJwt, checkScopes('update:preferences'), checkUser, patchUserPreferences);

export default router;