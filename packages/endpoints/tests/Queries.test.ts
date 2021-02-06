import { Queries } from '../src';
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

const queries = new Queries({
	token: 'token',
	interval: 0
});

describe('Mutations class', () => {
	[
		'getPageVisits',
		'getUserSharedPages',
		'getUserTasks',
		'getPublicPageData',
		'getPublicSpaceData',
		'getSubscriptionData',
		'getGenericEmbedBlockData',
		'getUploadFileUrl',
		'getGoogleDriveAccounts',
		'findUser',
		'getJoinableSpaces',
		'isUserDomainJoinable',
		'isEmailEducation',
		'getUserNotifications',
		'getTasks',
		'recordPageVisit'
	].map((method) => {
		it(`${method}`, async () => {
			mock.onPost(`/${method}`).replyOnce(200, response_data);
			const response = await (queries as any)[method](request_data);
			expect(deepEqual(response_data, response)).toBe(true);
		});
	});

	[
		'getSpaces',
		'getBacklinksForBlock',
		'syncRecordValues',
		'queryCollection',
		'loadUserContent',
		'loadPageChunk'
	].map((method) => {
		it(`${method}`, async () => {
			mock.onPost(`/${method}`).replyOnce(200, {
				recordMap: {
					block: response_data
				}
			});
			const response = await (queries as any)[method](request_data);
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

	it(`loadBlockSubtree`, async () => {
		mock.onPost(`/loadBlockSubtree`).replyOnce(200, {
			subtreeRecordMap: {
				block: response_data
			}
		});
		const response = await queries.loadBlockSubtree(request_data);
		expect(
			deepEqual(
				{
					subtreeRecordMap: {
						block: response_data
					}
				},
				response
			)
		).toBe(true);
	});
});
