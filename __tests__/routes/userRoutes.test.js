import { jest } from '@jest/globals';
import { addUser, getUser, patchUserPreferences, updateAuth0User } from '../../controllers/userControllers.js';
import connectDb from '../fixtures/db.js';
import mongoose from 'mongoose';
import { fakeUser } from '../fixtures/fakeUser.js';
import errorCodes from '../../utils/errorCodes.js';

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
		};
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
						};
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

	describe('PUT /users/:id', () => {
		afterEach(async () => {
			await db.collection('users').deleteMany({});
		});

		it('should create a new user', async () => {
			const res = await addUser('user-id', resMock, {
				get: jest.fn().mockImplementation(() => Promise.resolve(fakeUser))
			});

			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({
				message: 'User created',
				user: fakeUser
			});
		});

		it('should update an existing user', async () => {
			await db.collection('users').insertOne(fakeUser);

			const res = await addUser('user-id', resMock, {
				get: jest.fn().mockImplementation(() => Promise.resolve(fakeUser))
			});

			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({
				message: 'User created',
				user: fakeUser
			});
		});

		it('should return 400 if the user id is invalid', async () => {
			const res = await addUser('invalid-id', resMock, {
				get: jest.fn().mockRejectedValue({ errorCode: 'invalid_uri' })
			});

			expect(res.status).toBe(400);
			expect(res.body).toStrictEqual(errorCodes.userCreation.invalidId('invalid-id'));
		});

		it('should return 400 if the user does not exist', async () => {
			const res = await addUser('non-existent', resMock, {
				get: jest.fn().mockRejectedValue({ errorCode: 'inexistent_user' })
			});

			expect(res.status).toBe(400);
			expect(res.body).toBe(errorCodes.userCreation.invalidUser);
		});

		it('should return 500 if there is an error', async () => {
			const res = await addUser('user-id', resMock, {
				get: jest.fn().mockRejectedValue(new Error('Test error'))
			});

			expect(res.status).toBe(500);
			expect(res.body).toBe('Error creating user');
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

		it('should return 404 if the user does not exist', async () => {
			const res = await getUser({
				params: { id: 'non-existent' }
			}, resMock);

			expect(res.status).toBe(404);
			expect(res.body).toBe('User not found');
		});
	});

	describe('PATCH /users/:id/preferences', () => {
		beforeEach(async () => {
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
			}, resMock);

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
			}, resMock);

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
			}, resMock);

			expect(res.status).toBe(200);

			const updatedUser = await db.collection('users').findOne({ _id: 'user-id' });
			expect(updatedUser).not.toHaveProperty('newField');
		});

		it('should return 404 if the user does not exist', async () => {
			const res = await patchUserPreferences({
				params: { id: 'non-existent' },
				headers: { test: 'true' },
				body: {
					pisteDifficulties: { ...fakeUser.preferences.pisteDifficulties, black: false },
					liftTypes: { ...fakeUser.preferences.liftTypes, platter: false, tBar: false }
				}
			}, resMock);

			expect(res.status).toBe(404);
			expect(res.body).toBe('User not found');
		});
	});

	afterEach(async () => {
		await db.collection('users').deleteMany({});
	});
});

afterAll(async () => {
	// You're my wonderwall
	await db.collection('users').deleteMany({});
	await mongoose.connection.close();
});