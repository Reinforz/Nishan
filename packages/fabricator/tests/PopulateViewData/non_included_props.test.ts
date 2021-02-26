import { PopulateViewData } from '../../libs';

describe('PopulateViewData.non_included_props', () => {
	it(`type=table`, () => {
		expect(
			PopulateViewData.non_included_props(
				'table',
				{
					title: {
						type: 'title',
						name: 'Title'
					},
					number: {
						type: 'number',
						name: 'Number'
					}
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
					title: {
						type: 'title',
						name: 'Title'
					},
					number: {
						type: 'number',
						name: 'Number'
					}
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
});
