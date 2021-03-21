import { NotionUtils } from '../libs';

describe('populateChildPath', () => {
	it(`Should work when path doesn't exist`, () => {
		const data: any = {};
		NotionUtils.populateChildPath({ data, child_id: '123', child_path: 'child_ids' });
		expect(data.child_ids).toStrictEqual([ '123' ]);
	});

	it(`Should work when path does exist`, () => {
		const data: any = { child_ids: [ '456' ] };
		NotionUtils.populateChildPath({ data, child_id: '123', child_path: 'child_ids' });
		expect(data.child_ids).toStrictEqual([ '456', '123' ]);
	});
});
