import { NotionEndpoints } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

const request_data = {
		req: 'request_data'
	},
	response_data = {
		res: 'response_data'
	};

([ 'disconnectTrello' ] as (keyof typeof NotionEndpoints.Mutations)[]).forEach((method) => {
	it(method, async () => {
		const configs = {
			token: 'token',
			interval: 0,
			user_id: ''
		};
		const notionRequestSendMock = jest
			.spyOn(NotionEndpoints.Request, 'send')
			.mockImplementationOnce(async () => response_data);
		const response = await NotionEndpoints.Mutations[method](request_data as any, configs);

		expect(notionRequestSendMock).toHaveBeenCalledWith(method, request_data, configs);
		expect(response_data).toStrictEqual(response);
	});
});
