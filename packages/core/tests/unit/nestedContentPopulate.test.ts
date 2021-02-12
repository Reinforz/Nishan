import { nestedContentPopulate } from '../../src';

describe('nestedContentPopulate', () => {
	it(`type=page`, async () => {
		const block_map = await nestedContentPopulate([], 'parent_id', 'block');
	});
});
