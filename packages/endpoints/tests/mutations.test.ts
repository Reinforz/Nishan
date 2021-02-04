import * as mutations from '../utils/mutations';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import deepEqual from 'deep-equal';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';

const mock = new MockAdapter(axios);

[
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
].forEach((method) => {
	it(method, async () => {
		const request_data = {
				req: 'request_data'
			},
			response_data = {
				res: 'response_data'
			};
		mock.onPost(`/${method}`).replyOnce(200, response_data);
		const response = await (mutations as any)[method](request_data, {
			token: 'token'
		});
		expect(deepEqual(response_data, response)).toBe(true);
	});
});
