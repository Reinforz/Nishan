import { Operation } from '../../src';

describe('Operation', () => {
	it(`Should return correct operation`, () => {
		expect(Operation.block.update('123', [ 'pages' ], {})).toStrictEqual({
			pointer: {
				table: 'block',
				id: '123'
			},
			path: [ 'pages' ],
			command: 'update',
			args: {}
		});
	});
});
