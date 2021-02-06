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
	[
		'setPageNotificationsAsRead',
		'setSpaceNotificationsAsRead',
		'inviteGuestsToSpace',
		'createSpace',
		'saveTransactions',
		'enqueueTask',
		'setBookmarkMetadata'
	].map((method) => {
		it(`${method}`, async () => {
			mock.onPost(`/${method}`).replyOnce(200, response_data);
			const response = await (mutations as any)[method](request_data);
			expect(deepEqual(response_data, response)).toBe(true);
		});
	});

	[ 'initializeGoogleDriveBlock', 'initializePageTemplate', 'removeUsersFromSpace' ].map((method) => {
		it(`${method}`, async () => {
			mock.onPost(`/${method}`).replyOnce(200, {
				recordMap: {
					block: response_data
				}
			});
			const response = await (mutations as any)[method](request_data);
			expect(
				deepEqual(
					{
						recordMap: {
							block: response_data
						}
					},
					response
				)
			).toBe(true);
		});
	});
});
