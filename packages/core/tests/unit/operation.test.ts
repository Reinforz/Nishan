import deepEqual from 'deep-equal';
import { Operation } from '../../src';

describe('Operation', () => {
	it(`Should return correct operation`, () => {
		expect(
			deepEqual(Operation.block.update('123', [ 'pages' ], {}), {
				path: [ 'pages' ],
				table: 'block',
				command: 'update',
				args: {},
				id: '123'
			})
		).toBe(true);
	});
});
