import { NotionInit } from '../libs';

it(`collection`, () => {
	const arg: any = {
		id: 'collection_1',
		schema: {},
		cover: '',
		icon: '',
		parent_id: 'block_1',
		format: {},
		name: [ [ 'Collection' ] ]
	};
	expect(NotionInit.collection(arg)).toStrictEqual(
		expect.objectContaining({
			...arg,
			parent_table: 'block',
			alive: true,
			migrated: false,
			version: 0
		})
	);
});
