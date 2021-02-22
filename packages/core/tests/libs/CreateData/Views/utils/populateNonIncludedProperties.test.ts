import { populateNonIncludedProperties } from '../../../../../libs/CreateData/Views/utils';

describe('populateNonIncludedProperties', () => {
	it(`type=table`, () => {
		expect(
			populateNonIncludedProperties(
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
			populateNonIncludedProperties(
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
