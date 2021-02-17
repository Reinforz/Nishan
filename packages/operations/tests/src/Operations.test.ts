import { Operation } from '../../src';

describe('Operation', () => {
	it(`Should return correct operation`, () => {
		expect(Operation.block.update('123', [ 'pages' ], {})).toStrictEqual({
			path: [ 'pages' ],
			table: 'block',
			command: 'update',
			args: {},
			id: '123'
		});
	});
});
