import { NotionConstants } from '@nishans/constants';
import { NotionCore } from '../../libs';

const schema_unit_map = NotionCore.CreateMaps.schemaUnit();

it(`Should contain correct keys and value`, () => {
	NotionConstants.schemaUnitTypes().forEach((schema_unit_map_key) =>
		expect(schema_unit_map[schema_unit_map_key] instanceof Map).toBe(true)
	);
});
