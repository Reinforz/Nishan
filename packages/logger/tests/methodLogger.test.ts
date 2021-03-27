import { NotionLogger } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`NotionLogger.methodLogger`, () => {
	const stdoutWriteMock = jest.spyOn((console as any)._stdout, 'write');
	NotionLogger.method.warn(`warning`);
	expect((stdoutWriteMock.mock.calls[0][0] as string).includes('warning')).toBe(true);
});
