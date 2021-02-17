import colors from 'colors';
import { error, warn } from '../../src';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('warn', () => {
	it(`Should log with correct format`, () => {
		console.log = jest.fn();
		const message = warn('123');
		expect(message).toBe('123');
		expect(console.log).toHaveBeenCalledWith(colors.yellow.bold('123'));
		expect(console.log).toHaveBeenCalledTimes(1);
		(console.log as jest.Mock<any, any>).mockReset();
	});
});

describe('error', () => {
	it(`Should log with correct format`, () => {
		console.log = jest.fn();
		const message = error('123');
		expect(message).toBe('123');
		expect(console.log).toHaveBeenCalledWith(colors.red.bold('123'));
		expect(console.log).toHaveBeenCalledTimes(1);
		(console.log as jest.Mock<any, any>).mockReset();
	});
});
