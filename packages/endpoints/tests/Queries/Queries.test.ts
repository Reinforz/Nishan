import { NotionEndpoints } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

const configs = {
		token: 'token',
		interval: 0
	},
	request_data = {
		req: 'request_data'
	},
	response_data = {
		res: 'response_data'
	};

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
	'search',
	'getClientExperiments',
	'checkEmailType'
] as (keyof typeof NotionEndpoints.Queries)[]).forEach((method) => {
	it(method, async () => {
		const notionRequestSendMock = jest
			.spyOn(NotionEndpoints.Request, 'send')
			.mockImplementationOnce(async () => response_data);
		const response = await NotionEndpoints.Queries[method](request_data as any, configs);
		expect(notionRequestSendMock).toHaveBeenCalledWith(method, request_data, configs);
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
	'isEmailEducation',
	'ping'
] as (keyof typeof NotionEndpoints.Queries)[]).forEach((method) => {
	it(method, async () => {
		const notionRequestSendMock = jest
			.spyOn(NotionEndpoints.Request, 'send')
			.mockImplementationOnce(async () => response_data);
		const response = await NotionEndpoints.Queries[method](configs as any);
		expect(notionRequestSendMock).toHaveBeenCalledWith(method, {}, configs);
		expect(response_data).toStrictEqual(response);
	});
});
