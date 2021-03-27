import { NotionLogger } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`NotionLogger.endpointLogger`, () => {
	const stdoutWriteMock = jest.spyOn((console as any)._stdout, 'write');
	NotionLogger.endpoint.warn(`warning`);
	expect((stdoutWriteMock.mock.calls[0][0] as string).includes('warning')).toBe(true);
});
