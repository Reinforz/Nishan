import { generateSchemaMapFromCollectionSchema } from '@nishans/notion-formula';
import { tsu } from '../../fabricator/tests/utils';
import { getSchemaMapUnit } from '../libs';

it(`Should get schema map unit`, () => {
	const schema_map_unit = getSchemaMapUnit(generateSchemaMapFromCollectionSchema({ title: tsu }), 'Title', []);
	expect(schema_map_unit).toStrictEqual({ ...tsu, schema_id: 'title' });
});

it(`Should throw if schema map unit doesn't exist`, () => {
	expect(() => getSchemaMapUnit(generateSchemaMapFromCollectionSchema({ title: tsu }), 'title', [])).toThrow();
});
