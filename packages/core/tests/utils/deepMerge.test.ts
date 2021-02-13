import deepEqual from 'deep-equal';
import { deepMerge } from '../../src';

it(`Should work for object source and target`, () => {
	expect(
		deepEqual(deepMerge({ a: { b: 2, c: 3 } }, { a: { b: 1 } }), {
			a: {
				b: 1,
				c: 3
			}
		})
	).toBe(true);
});

it(`Should work for non object source`, () => {
	expect(deepEqual(deepMerge({ a: { b: 2, c: 3 } }, false), { a: { b: 2, c: 3 } })).toBe(true);
});

it(`Should work for source key not in target`, () => {
	expect(deepEqual(deepMerge({ a: { b: 2, c: 3 } }, { b: { c: 1 } }), { a: { b: 2, c: 3 }, b: { c: 1 } })).toBe(true);
});
