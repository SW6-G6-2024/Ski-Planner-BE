import request from 'supertest';
import express from 'express';
import router from '../../routes/userRoutes.js';
/*import { ManagementClient } from 'auth0';
import { requiredScopes } from 'express-oauth2-jwt-bearer';
import { checkJwt } from '../../utils/authorization.js';*/
import { jest } from '@jest/globals';

const app = express();
app.use(express.json());
app.use('/api/users', router);

const PORT = 1234;

const server = app.listen(PORT);
const url = `http://localhost:${PORT}`;

jest.mock('auth0', () => {
	return {
		ManagementClient: jest.fn().mockImplementation(() => {
			return {
				users: {
					update: jest.fn(),
				},
			};
		}),
	};
});

jest.mock('express-oauth2-jwt-bearer', () => {
	return {
		requiredScopes: jest.fn().mockImplementation(() => {
			return (req, res, next) => {
				if (req.headers.authorization === 'Bearer ') {
					return next();
				}
				return res.status(401).send('Unauthorized');
			};
		}),
	};
});

jest.mock('../../utils/authorization.js', () => {
	return {
		checkJwt: jest.fn().mockImplementation(() => {
			return (req, res, next) => {
				req.user = {
					sub: 'user-id',
				};
				next();
			};
		}),
		checkScopes: jest.fn().mockImplementation(() => {
			return (req, res, next) => {
				if (req.headers.authorization === 'Bearer ') {
					return next();
				}
				return res.status(401).send('Unauthorized');
			};
		}),
	};
});

describe('User Routes', () => {
	describe('PATCH /users/:id', () => {
		// eslint-disable-next-line jest/no-commented-out-tests
		/*it('should update the user', async () => {
			const userId = 'user-id';
			const updatedUser = {
				name: 'John Doe',
				email: 'john.doe@example.com',
			};

			const management = new ManagementClient(
				{
					domain: 'auth0-domain',
					clientId: 'auth0-client',
					clientSecret: 'auth0-secret',
				}
			);

			const response = await request(url)
				.patch(`/api/users/${userId}`)
				.set('Authorization', 'Bearer ')
				.send(updatedUser);

			expect(response.status).toBe(200);
			expect(response.body).toEqual(updatedUser);
			expect(management.users.update).toHaveBeenCalledWith({ id: userId }, updatedUser);
		});*/

		it('should return 401 if not authorized', async () => {
			const response = await request(url)
				.patch('/api/users/user-id');

			expect(response.status).toBe(401);
		});
	});
});

afterAll(() => {
	// You're my wonderwall
	server.close();
});