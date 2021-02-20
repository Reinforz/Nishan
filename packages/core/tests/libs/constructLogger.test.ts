import colors from 'colors';
import { constructLogger } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('constructLogger', () => {
	it(`arg=false`, () => {
		expect(constructLogger(false)).toBe(false);
	});

	it(`arg=fn`, () => {
		const logger_spy = jest.fn();
		const logger = constructLogger(logger_spy);
		expect(typeof logger).toBe('function');
		(logger as any)('READ', 'block', 'id');
		expect(logger_spy).toHaveBeenCalledTimes(1);
		expect(logger_spy).toHaveBeenCalledWith('READ', 'block', 'id');
	});

	it(`arg=undefined`, () => {
		const console_log_spy = jest.spyOn(console, 'log');
		const logger = constructLogger();
		expect(typeof logger).toBe('function');
		(logger as any)('READ', 'block', 'id');
		expect(console_log_spy).toHaveBeenCalledTimes(1);
		expect(console_log_spy).toHaveBeenCalledWith(`${colors.red('READ')} ${colors.green('block')} ${colors.blue('id')}`);
		console_log_spy.mockRestore();
	});
});
