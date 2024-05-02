import { ManagementClient } from 'auth0';
import env from '../../config/keys.js';

const management = new ManagementClient({
	domain: env.auth0Domain,
	clientId: env.auth0ClientId,
	clientSecret: env.auth0ClientSecret
});

async function updateAuth0User(id, body, res, updateFunc = management.users.update) {
	try {
		await updateFunc({ id }, body); 
		return res.status(200).send('User updated');
	} catch (error) {
		console.error(error);
		return res.status(500).send('Error updating user');
	}
}

export { updateAuth0User };