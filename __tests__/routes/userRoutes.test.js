import request from 'supertest';
import express from 'express';
import router from '../../routes/userRoutes.js';
import { jest } from '@jest/globals';
import { updateAuth0User } from '../../utils/helpers/updateAuth0User.js';

const app = express();
app.use(express.json());
app.use('/api/users', router);

const PORT = 1234;

const server = app.listen(PORT);
const url = `http://localhost:${PORT}`;

const managementMock = jest.fn().mockImplementation(() => {
	return {
		users: {
			update: jest.fn().mockImplementation(() => {
				return Promise.resolve();
			}
			)
		}
	};
});

jest.mock('../../utils/helpers/updateAuth0User.js', () => ({
	updateAuth0User: jest.fn().mockImplementation(async (managementClient, id, body, res) => {
		console.log('updateAuth0User called')
		return Promise.resolve();
	})
}));

/*jest.mock('../../utils/authorization.js', () => ({
	checkJwt: jest.fn().mockImplementation(() => {
		return (req, res, next) => {
			console.log("checkJwt called")
			next();
		};
	}),
	checkScopes: jest.fn().mockImplementation(() => {
		return (req, res, next) => {
			if (req.headers.authorization === 'Bearer test') {
				return next();
			}
			return res.status(401).send('Unauthorized');
		};
	}),
	checkUser: jest.fn().mockImplementation(() => {
		return (req, res, next) => {
			next();
		};
	}),
}));*/

describe('User Routes', () => {
	describe('PATCH /users/:id', () => {
		it('should update the user', async () => {
			const res = await updateAuth0User('user-id', {
				name: 'John Doe',
				email: 'john.doe@example.com'
			},
				{
					status: jest.fn().mockImplementation(() => {
						return {
							send: jest.fn().mockImplementation(() => ({
								status: 200,
								body: 'User updated'
							}))
						}
					}),
					send: jest.fn()
				},
				managementMock);
			expect(res.status).toBe(200);
			expect(res.body).toBe('User updated');
			expect(managementMock).toHaveBeenCalledWith('user-id', {
				name: 'John Doe',
				email: 'john.doe@example.com'
			});
		});
		// eslint-disable-next-line jest/no-commented-out-tests
		/*
		it('should update the user', async () => {
			const userId = 'user-id';
			const updatedUser = {
				name: 'John Doe',
				email: 'john.doe@example.com',
			};

			const response = await request(url)
				.patch(`/api/users/${userId}`)
				.set('authorization', 'Bearer test')
				.send(updatedUser);

			expect(response.status).toBe(200);
			expect(response.body).toEqual(updatedUser);
			expect(management.users.update).toHaveBeenCalledWith({ id: userId }, updatedUser);
		});*/

		it('should return 401 if not authorized', async () => {
			/*const response = await request(url)
				.patch('/api/users/user-id');

			expect(response.status).toBe(500);*/
		});
	});
});

afterAll(() => {
	// You're my wonderwall
	server.close();
});