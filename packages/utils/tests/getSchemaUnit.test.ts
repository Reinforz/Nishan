import { tsu } from '../../fabricator/tests/utils';
import { NotionUtils } from '../libs';

it(`returns schema unit`, () => {
	const schema_unit = NotionUtils.getSchemaUnit(
		{
			title: tsu
		},
		'title',
		[]
	);
	expect(schema_unit).toStrictEqual(tsu);
});

it(`Throw error for unknown property`, () => {
	expect(() =>
		NotionUtils.getSchemaUnit(
			{
				title: tsu
			},
			'titles',
			[]
		)
	).toThrow();
});
