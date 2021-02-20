import { populateNonIncludedProperties } from '../../../../../libs/CreateData/Views/utils';

describe('populateNonIncludedProperties', () => {
	it(`Should work correctly`, () => {
		expect(
			populateNonIncludedProperties(
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
});
