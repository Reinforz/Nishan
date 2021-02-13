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

	it(`arg=fn`, () => {
		const fn = () => {
			return;
		};
		const data = transformToMultiple(fn);
		expect(data).toBe(fn);
	});

	it(`arg=[]`, () => {
		const data = transformToMultiple([ 'id', '123' ]);
		expect(deepEqual(data, [ [ 'id', '123' ] ])).toBe(true);
	});
});
