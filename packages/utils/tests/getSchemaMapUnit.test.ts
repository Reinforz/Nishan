import { generateSchemaMapFromCollectionSchema } from '@nishans/notion-formula';
import { tsu } from '../../fabricator/tests/utils';
import { NotionUtils } from '../libs';

it(`Should get schema map unit`, () => {
	const schema_map_unit = NotionUtils.getSchemaMapUnit(
		generateSchemaMapFromCollectionSchema({ title: tsu }),
		'Title',
		[]
	);
	expect(schema_map_unit).toStrictEqual({ ...tsu, schema_id: 'title' });
});

it(`Should throw if schema map unit doesn't exist`, () => {
	expect(() =>
		NotionUtils.getSchemaMapUnit(generateSchemaMapFromCollectionSchema({ title: tsu }), 'title', [])
	).toThrow();
});
