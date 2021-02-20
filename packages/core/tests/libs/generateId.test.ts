import colors from 'colors';
import { v4 as uuidv4 } from 'uuid';
import { createShortId, generateId } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('generateId', () => {
	it(`Should generate random id when none provided`, () => {
		expect(generateId()).toBeTruthy();
	});

	it(`Should return passed id when correct id is provided`, () => {
		expect(generateId(uuidv4())).toBeTruthy();
	});

	it(`Should generate random id when correct id is not provided`, () => {
		const consoleLogMock = jest.spyOn(console, 'log');
		const generated_id = generateId(uuidv4().slice(1));
		expect(generated_id).toBeTruthy();
		expect(consoleLogMock).toHaveBeenCalledWith(colors.yellow.bold('Invalid uuid provided'));
		expect(consoleLogMock).toHaveBeenCalledTimes(1);
	});
});

describe('createShortId', () => {
	it(`Should create short id with default length`, () => {
		const short_id = createShortId();
		expect(short_id).toBeTruthy();
		expect(short_id.length).toBe(5);
	});

	it(`Should create short id with custom length`, () => {
		const short_id = createShortId(6);
		expect(short_id).toBeTruthy();
		expect(short_id.length).toBe(6);
	});
});
