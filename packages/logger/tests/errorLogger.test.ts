import colors from 'colors';
import { NotionLogger } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`NotionLogger.methodLogger`, () => {
	const stdoutWriteMock = jest.spyOn((console as any)._stdout, 'write');
	expect(() => NotionLogger.error(`error`)).toThrow(colors.red.bold(`error`));
	expect((stdoutWriteMock.mock.calls[0][0] as string).includes('error')).toBe(true);
});
