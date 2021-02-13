import deepEqual from 'deep-equal';
import { transformToMultiple } from '../../src';

describe('transformToMultiple', () => {
	it(`arg=undefined`, () => {
		const data = transformToMultiple();
		expect(typeof data).toBe('function');
		expect((data as any)()).toBe(true);
	});

	it(`arg=string`, () => {
		const data = transformToMultiple('123');
		expect(deepEqual(data, [ '123' ])).toBe(true);
	});

	it(`arg=string`, () => {
		const fn = () => {
			return;
		};
		const data = transformToMultiple(fn);
		expect(data).toBe(fn);
	});
});
