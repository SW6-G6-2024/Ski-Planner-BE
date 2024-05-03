import request from 'supertest';
import express from 'express';
import router from '../../routes/userRoutes.js';
import { jest } from '@jest/globals';
import { updateAuth0User } from '../../utils/helpers/updateAuth0User.js';
import { getUser, patchUserPreferences } from '../../controllers/userControllers.js';
import connectDb from '../fixtures/db.js';
import mongoose from 'mongoose';
import { fakeUser } from '../fixtures/fakeUser.js';

const app = express();
app.use(express.json());
app.use('/api/users', router);

const PORT = 1234;

const server = app.listen(PORT);
const url = `http://localhost:${PORT}`;

const updateMock = jest.fn().mockImplementation(() => {
	return Promise.resolve();
});

const resMock = {
	status: jest.fn().mockImplementation((status) => {
		return {
			send: jest.fn().mockImplementation((body) => ({
				status: status,
				body: body
			}))
		}
	}),
};

let db;
beforeAll(async () => {
	db = await connectDb();
});

describe('User Routes', () => {
	describe('PATCH /users/:id', () => {
		it('should update the user', async () => {
			const res = await updateAuth0User('user-id', {
				name: 'John Doe',
				email: 'john.doe@example.com'
			},
				{
					status: jest.fn().mockImplementation((status) => {
						return {
							send: jest.fn().mockImplementation((body) => ({
								status: status,
								body: body
							}))
						}
					}),
				},
				updateMock);
			expect(res.status).toBe(200);
			expect(res.body).toBe('User updated');
			expect(updateMock).toHaveBeenCalledWith({ id: 'user-id' }, {
				name: 'John Doe',
				email: 'john.doe@example.com'
			});
		});
	});

	describe('GET /users/:id', () => {
		beforeAll(async () => {
			await db.collection('users').insertOne(fakeUser);
		});

		it('should get the user', async () => {
			const res = await getUser({
				params: { id: 'user-id' }
			}, resMock);

			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({
				_id: fakeUser._id,	
				preferences: fakeUser.preferences,
				createdAt: expect.any(Date),
				modifiedAt: expect.any(Date)
			});
		});
	});

	describe('PATCH /users/:id/preferences', () => {
		beforeEach( async () => {
			await db.collection('users').deleteMany({});
			await db.collection('users').insertOne(fakeUser);
		});

		it('should update the user preferences', async () => {
			const res = await patchUserPreferences({
				params: { id: 'user-id' },
				headers: { test: 'true' },
				body: {
					pisteDifficulties: { ...fakeUser.preferences.pisteDifficulties, black: false },
					liftTypes: { ...fakeUser.preferences.liftTypes, platter: false, tBar: false }
				}
			}, resMock)

			expect(res.status).toBe(200);

			const updatedUser = await db.collection('users').findOne({ _id: 'user-id' });
			expect(updatedUser.preferences).toMatchObject({
				pisteDifficulties: { ...fakeUser.preferences.pisteDifficulties, black: false },
				liftTypes: { ...fakeUser.preferences.liftTypes, platter: false, tBar: false }
			});
		});

		it('should work with partial updates', async () => {
			const res = await patchUserPreferences({
				params: { id: 'user-id' },
				headers: { test: 'true' },
				body: {
					pisteDifficulties: {
						black: false
					}
				}
			}, resMock)

			expect(res.status).toBe(200);

			const updatedUser = await db.collection('users').findOne({ _id: 'user-id' });
			expect(updatedUser.preferences).toMatchObject({
				pisteDifficulties: { ...fakeUser.preferences.pisteDifficulties, black: false },
				liftTypes: fakeUser.preferences.liftTypes
			});
		});

		it('should not add new fields', async () => {
			const res = await patchUserPreferences({
				params: { id: 'user-id' },
				headers: { test: 'true' },
				body: {
					newField: 'new value'
				}
			}, resMock)

			expect(res.status).toBe(200);

			const updatedUser = await db.collection('users').findOne({ _id: 'user-id' });
			expect(updatedUser).not.toHaveProperty('newField');
		})
	});

	afterEach(async () => {
		await db.collection('users').deleteMany({});
	});
});

afterAll(async () => {
	// You're my wonderwall
	await db.collection('users').deleteMany({});
	await mongoose.connection.close();
	server.close();
});