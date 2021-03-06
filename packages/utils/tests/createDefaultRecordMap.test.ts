import { NotionConstants } from '@nishans/constants';
import { NotionUtils } from '../libs';

it(`createDefaultRecordMap`, () => {
	const created_default_record_map = NotionUtils.createDefaultRecordMap();
	const data_types = NotionConstants.dataTypes();
	data_types.forEach((data_type) => expect(Array.isArray(created_default_record_map[data_type])).toBe(true));
});
