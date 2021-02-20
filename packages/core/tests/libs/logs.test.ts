import colors from 'colors';
import { error, warn } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('warn', () => {
	it(`Should log with correct format`, () => {
		const consoleLogMock = jest.spyOn(console, 'log');
		const message = warn('123');
		expect(message).toBe('123');
		expect(consoleLogMock).toHaveBeenCalledWith(colors.yellow.bold('123'));
		expect(consoleLogMock).toHaveBeenCalledTimes(1);
	});
});

describe('error', () => {
	it(`Should log with correct format`, () => {
		const consoleLogMock = jest.spyOn(console, 'log');
		const message = error('123');
		expect(message).toBe('123');
		expect(consoleLogMock).toHaveBeenCalledWith(colors.red.bold('123'));
		expect(consoleLogMock).toHaveBeenCalledTimes(1);
	});
});
