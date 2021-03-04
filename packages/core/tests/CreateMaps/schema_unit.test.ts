import { NotionConstants } from '@nishans/constants';
import { CreateMaps } from '../../libs';

const schema_unit_map = CreateMaps.schema_unit();

it(`Should contain correct keys and value`, () => {
	NotionConstants.schema_unit_types().forEach((schema_unit_map_key) =>
		expect(schema_unit_map[schema_unit_map_key] instanceof Map).toBe(true)
	);
});
