import { ViewSorts } from '@nishans/types';
import { NotionFabricator } from '../../../libs';

it(`Sort text`, () => {
	const query2 = {
		sort: []
	};

	NotionFabricator.PopulateViewData.query2.sort('ascending', 'text', query2.sort);

	expect(query2).toStrictEqual({
		sort: [
			{
				property: 'text',
				direction: 'ascending'
			}
		]
	});
});

it(`Sort [TSort, number]`, () => {
	const query2 = {
		sort: [
			{
				property: 'number',
				direction: 'descending'
			}
		] as ViewSorts[]
	};

	NotionFabricator.PopulateViewData.query2.sort([ 'ascending', 0 ], 'text', query2.sort);

	expect(query2).toStrictEqual({
		sort: [
			{
				property: 'text',
				direction: 'ascending'
			},
			{
				property: 'number',
				direction: 'descending'
			}
		]
	});
});
