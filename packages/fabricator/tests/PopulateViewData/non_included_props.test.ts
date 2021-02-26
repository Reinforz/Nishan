import { PopulateViewData } from '../../libs';
import { nsu, tsu } from '../utils';

it(`type=table`, () => {
	expect(
		PopulateViewData.non_included_props(
			'table',
			{
				title: tsu,
				number: nsu
			},
			[ 'number' ]
		)
	).toStrictEqual([
		{
			property: 'title',
			visible: false,
			width: 250
		}
	]);
});

it(`type=list`, () => {
	expect(
		PopulateViewData.non_included_props(
			'list',
			{
				title: tsu,
				number: nsu
			},
			[ 'number' ]
		)
	).toStrictEqual([
		{
			property: 'title',
			visible: false
		}
	]);
});
