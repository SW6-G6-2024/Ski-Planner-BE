async function updateAuth0User(managementClient, id, body, res) {
	try {
		await managementClient.users.update({ id }, body); 
	} catch (error) {
		console.error(error);
		return res.status(500).send('Error updating user');
	}
}

export { updateAuth0User };