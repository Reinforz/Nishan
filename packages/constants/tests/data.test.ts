import { TDataType } from '@nishans/types';
import { NotionConstants } from '../libs';

it('NotionConstants.data_types', () => {
	const data_types = NotionConstants.data_types();
	const expected_data_types: TDataType[] = [
		'block',
		'collection',
		'collection_view',
		'space',
		'notion_user',
		'space_view',
		'user_root',
		'user_settings'
	];

	expect(data_types.length === expected_data_types.length).toBe(true);
	expected_data_types.forEach((expected_data_type) => expect(data_types.includes(expected_data_type)).toBe(true));
});
