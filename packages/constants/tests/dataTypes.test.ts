import { TDataType } from '@nishans/types';
import { NotionConstants } from '../libs';

it('NotionConstants.dataTypes', () => {
	const data_types = NotionConstants.dataTypes();
	const data_types_map: Map<TDataType, true> = new Map();
	data_types.forEach((data_type) => data_types_map.set(data_type, true));

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
	expected_data_types.forEach((expected_data_type) => expect(data_types_map.get(expected_data_type)).toBe(true));
});
