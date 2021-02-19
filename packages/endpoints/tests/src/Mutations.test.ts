import { Mutations, NotionRequest } from '../../src';

afterEach(() => {
	jest.restoreAllMocks();
});

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
		const configs = {
			token: 'token',
			interval: 0
		};
		const notionRequestSendMock = jest.spyOn(NotionRequest, 'send').mockImplementationOnce(async () => response_data);
		const response = await Mutations[method](request_data as any, configs);

		expect(notionRequestSendMock).toHaveBeenCalledWith(method, request_data, configs);
		expect(response_data).toStrictEqual(response);
	});
});
