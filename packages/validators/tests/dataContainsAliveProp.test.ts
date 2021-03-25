import { TDataType } from '@nishans/types';
import { NotionValidators } from '../libs';

describe(`dataContainsAliveProp`, () => {
	([ 'block', 'space_view', 'collection_view', 'comment' ] as TDataType[]).forEach((data_type) => {
		it(`Should work for ${data_type}`, () => {
			expect(NotionValidators.dataContainsAliveProp(data_type)).toBe(true);
		});
	});

	it(`Should return false for space`, () => {
		expect(NotionValidators.dataContainsAliveProp('space')).toBe(false);
	});
});
