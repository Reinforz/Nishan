import { createShortId } from '../../src';

it(`Should create short id with default length`, () => {
	const short_id = createShortId();
	expect(short_id).toBeTruthy();
	expect(short_id.length).toBe(4);
});

it(`Should create short id with custom length`, () => {
	const short_id = createShortId(6);
	expect(short_id).toBeTruthy();
	expect(short_id.length).toBe(6);
});
