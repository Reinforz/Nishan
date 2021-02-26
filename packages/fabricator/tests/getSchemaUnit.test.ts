import { getSchemaUnit } from '../libs';
import { tsu } from './utils';

it(`returns schema unit`, () => {
	const schema_unit = getSchemaUnit(
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
		getSchemaUnit(
			{
				title: tsu
			},
			'titles',
			[]
		)
	).toThrow();
});
