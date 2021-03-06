import colors from 'colors';
import { NotionFabricator } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('NotionFabricator.constructLogger', () => {
	it(`arg=false`, () => {
		expect(NotionFabricator.constructLogger(false)).toBe(false);
	});

	it(`arg=fn`, () => {
		const logger_spy = jest.fn();
		const logger = NotionFabricator.constructLogger(logger_spy);
		expect(typeof logger).toBe('function');
		(logger as any)('READ', 'block', 'id');
		expect(logger_spy).toHaveBeenCalledTimes(1);
		expect(logger_spy).toHaveBeenCalledWith('READ', 'block', 'id');
	});

	it(`arg=undefined`, () => {
		const console_log_spy = jest.spyOn(console, 'log');
		const logger = NotionFabricator.constructLogger();
		expect(typeof logger).toBe('function');
		(logger as any)('READ', 'block', 'id');
		expect(console_log_spy).toHaveBeenCalledTimes(1);
		expect(console_log_spy).toHaveBeenCalledWith(`${colors.red('READ')} ${colors.green('block')} ${colors.blue('id')}`);
		console_log_spy.mockRestore();
	});
});
