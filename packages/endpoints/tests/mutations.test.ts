import { Mutations } from '../src';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import deepEqual from 'deep-equal';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';

const mock = new MockAdapter(axios);

const request_data: any = {
		req: 'request_data'
	},
	response_data: any = {
		res: 'response_data'
	};

const mutations = new Mutations({
	shard_id: 123,
	space_id: 'space_id',
	token: 'token',
	interval: 0
});

describe('Mutations class', () => {
	it(`setPageNotificationsAsRead should work correctly`, async () => {
		mock.onPost(`/setPageNotificationsAsRead`).replyOnce(200, response_data);
		const response = await mutations.setPageNotificationsAsRead(request_data);
		expect(deepEqual(response_data, response)).toBe(true);
	});

	it(`setSpaceNotificationsAsRead should work correctly`, async () => {
		mock.onPost(`/setSpaceNotificationsAsRead`).replyOnce(200, response_data);
		const response = await mutations.setSpaceNotificationsAsRead(request_data);
		expect(deepEqual(response_data, response)).toBe(true);
	});

	it(`inviteGuestsToSpace should work correctly`, async () => {
		mock.onPost(`/inviteGuestsToSpace`).replyOnce(200, response_data);
		const response = await mutations.inviteGuestsToSpace(request_data);
		expect(deepEqual(response_data, response)).toBe(true);
	});

	it(`createSpace should work correctly`, async () => {
		mock.onPost(`/createSpace`).replyOnce(200, response_data);
		const response = await mutations.createSpace(request_data);
		expect(deepEqual(response_data, response)).toBe(true);
	});

	it(`saveTransactions should work correctly`, async () => {
		mock.onPost(`/saveTransactions`).replyOnce(200, response_data);
		const response = await mutations.saveTransactions(request_data);
		expect(deepEqual(response_data, response)).toBe(true);
	});

	it(`enqueueTask should work correctly`, async () => {
		mock.onPost(`/enqueueTask`).replyOnce(200, response_data);
		const response = await mutations.enqueueTask(request_data);
		expect(deepEqual(response_data, response)).toBe(true);
	});

	it(`setBookmarkMetadata should work correctly`, async () => {
		mock.onPost(`/setBookmarkMetadata`).replyOnce(200, response_data);
		const response = await mutations.setBookmarkMetadata(request_data);
		expect(deepEqual(response_data, response)).toBe(true);
	});
});
