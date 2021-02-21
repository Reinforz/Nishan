import { v4 } from 'uuid';
import { generateId } from '../../src';

it(`Should generate random id when none provided`, () => {
	expect(generateId()).toBeTruthy();
});

it(`Should return passed id when correct id is provided`, () => {
	expect(generateId(v4())).toBeTruthy();
});

it(`Should generate random id when correct id is not provided`, () => {
	const consoleLogMock = jest.spyOn(console, 'log');
	const generated_id = generateId(v4().slice(1));
	expect(generated_id).toBeTruthy();
	expect(consoleLogMock).toHaveBeenCalledWith('Invalid uuid provided');
	expect(consoleLogMock).toHaveBeenCalledTimes(1);
});
