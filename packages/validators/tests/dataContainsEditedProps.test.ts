import { TDataType } from '@nishans/types';
import { NotionValidators } from '../libs';

describe(`dataContainsEditedProps`, () => {
	([ 'block', 'space', 'comment' ] as TDataType[]).forEach((data_type) => {
		it(`Should work for ${data_type}`, () => {
			expect(NotionValidators.dataContainsEditedProps(data_type)).toBe(true);
		});
	});

	it(`Should return false for space_view`, () => {
		expect(NotionValidators.dataContainsEditedProps('space_view')).toBe(false);
	});
});
