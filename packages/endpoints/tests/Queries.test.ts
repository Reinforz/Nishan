import Queries from '../src/Queries';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';

const mock = new MockAdapter(axios);

([
	'getPageVisits',
	'getUserSharedPages',
	'getPublicPageData',
	'getPublicSpaceData',
	'getSubscriptionData',
	'loadBlockSubtree',
	'getGenericEmbedBlockData',
	'getUploadFileUrl',
	'getBacklinksForBlock',
	'findUser',
	'syncRecordValues',
	'queryCollection',
	'loadPageChunk',
	'recordPageVisit',
	'getUserNotifications',
	'getTasks',
	'search'
] as (keyof typeof Queries)[]).forEach((method) => {
	it(method, async () => {
		const request_data = {
				req: 'request_data'
			},
			response_data = {
				res: 'response_data'
			};
		mock.onPost(`/${method}`).replyOnce(200, response_data);
		const response = await Queries[method](request_data as any, {
			token: 'token',
			interval: 0
		});
		expect(response_data).toStrictEqual(response);
	});
});

([
	'getUserTasks',
	'getSpaces',
	'getGoogleDriveAccounts',
	'loadUserContent',
	'getJoinableSpaces',
	'isUserDomainJoinable',
	'isEmailEducation'
] as (keyof typeof Queries)[]).forEach((method) => {
	it(method, async () => {
		const response_data = {
			res: 'response_data'
		};
		mock.onPost(`/${method}`).replyOnce(200, response_data);
		const response = await Queries[method]({
			token: 'token',
			interval: 0
		} as any);
		expect(response_data).toStrictEqual(response);
	});
});
