import { Mutations } from '../src';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import deepEqual from 'deep-equal';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';

const mock = new MockAdapter(axios);

const request_data = {
		req: 'request_data'
	},
	response_data = {
		res: 'response_data'
	};

([
	'setPageNotificationsAsRead',
	'setSpaceNotificationsAsRead',
	'removeUsersFromSpace',
	'inviteGuestsToSpace',
	'createSpace',
	'saveTransactions',
	'enqueueTask',
	'setBookmarkMetadata',
	'initializePageTemplate',
	'initializeGoogleDriveBlock'
] as (keyof typeof Mutations)[]).forEach((method) => {
	it(method, async () => {
		mock.onPost(`/${method}`).replyOnce(200, response_data);
		const response = await Mutations[method](request_data as any, {
			token: 'token',
			interval: 0
		});
		expect(deepEqual(response_data, response)).toBe(true);
	});
});
