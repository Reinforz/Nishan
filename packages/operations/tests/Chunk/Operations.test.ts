import { NotionOperations } from '../../libs';

describe('Operation', () => {
	it(`Should return correct operation`, () => {
		expect(NotionOperations.Chunk.block.update('123', [ 'pages' ], {})).toStrictEqual({
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
