import express from 'express';
import env from '../config/keys.js';
import { ManagementClient } from 'auth0';
import { checkJwt, checkScopes, checkUser } from '../utils/authorization.js';
import UserModel from '../models/User.js';
import { handleError } from '../utils/helpers/userErrorHandling.js';
import { updateAuth0User } from '../utils/helpers/updateAuth0User.js';

const router = express.Router();

router.get('/:id', checkJwt, checkScopes('read:user'), checkUser, async (req, res) => {
	const { id } = req.params;

	try {
			console.log('id', id)
			const user = await UserModel.findById(id);
			if (!user) {
					return res.status(404).send('User not found');
			}
			return res.status(200).send(user);
	} catch (err) {
			return res.status(500).send('Error getting user');
	}
});

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

		console.log('Creating user with id:', id)

		management.users.get({ id }).then(async (user) => {
			UserModel.findByIdAndUpdate(id, {}, { upsert: true, new: true, setDefaultsOnInsert: true })
				.then(() => {
					console.log('User created/updated');
					return res.status(200).send('User created');
				}).catch((error) => {
					console.error(error);
				})
		}).catch((error) => {
			console.error(error);
			handleError(error, res, id);
			return;
		});

	});

// Routes
router.patch('/:id', /*checkJwt, checkScopes('update:user'), checkUser,*/
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

router.patch('/:id/preferences', checkJwt, checkScopes('update:preferences'), checkUser,
	/**
	 * Update the preferences of an existing user in the database
	 * @param {Express.Request} req 
	 * @param {Express.Response} res 
	 * @returns 
	 */
	async (req, res) => {
		const { id } = req.params;
		const body = req.body;

		let updatedUser;

		try {
			const user = await UserModel.findById(id);
			if (!user) {
				return res.status(404).send('User not found');
			}

			await UserModel.findByIdAndUpdate(id, {
				preferences: {
					pisteDifficulties: {
						green: body.pisteDifficulties?.green ?? user.preferences.pisteDifficulties.green,
						blue: body.pisteDifficulties?.blue ?? user.preferences.pisteDifficulties.blue,
						red: body.pisteDifficulties?.red ?? user.preferences.pisteDifficulties.red,
						black: body.pisteDifficulties?.black ?? user.preferences.pisteDifficulties.black,
					},
					liftTypes: {
						gondola: body.liftTypes?.gondola ?? user.preferences.liftTypes.gondola,
						chairlift: body.liftTypes?.chairlift ?? user.preferences.liftTypes.chairlift,
						tBar: body.liftTypes?.tBar ?? user.preferences.liftTypes.tBar,
						platter: body.liftTypes?.platter ?? user.preferences.liftTypes.platter,
					},
				}
			});

			updatedUser = await UserModel.findById(id);
		} catch (error) {
			console.error(error);
			return res.status(500).send('Error updating user preferences');
		}

		return res.status(200).send({
			message: 'User preferences updated successfully',
			user: updatedUser
		});
	});

export default router;