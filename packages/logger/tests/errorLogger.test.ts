import colors from 'colors';
import { NotionLogger } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`NotionLogger.methodLogger`, () => {
	expect(() => NotionLogger.error(`error`)).toThrow(colors.red.bold(`error`));
});
