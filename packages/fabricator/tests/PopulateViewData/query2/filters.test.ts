import { IViewFilter } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { IViewFilterCreateInput, NotionFabricator } from '../../../libs';

const schema_map = NotionUtils.generateSchemaMap({
	title: {
		type: 'text',
		name: 'Title'
	},
	text: {
		type: 'text',
		name: 'Text'
	}
});

afterEach(() => {
	jest.restoreAllMocks();
});

const filter: IViewFilterCreateInput<'text'>['filter'] = {
	operator: 'string_is',
	value: {
		type: 'exact',
		value: '123'
	}
};

it(`Should populate non nested filter`, () => {
	const parent_filter: IViewFilter = {
		operator: 'and',
		filters: []
	};

	NotionFabricator.PopulateViewData.query2.filters(
		[
			{
				filter,
				name: 'Title',
				type: 'text'
			}
		],
		parent_filter.filters,
		schema_map
	);

	expect(parent_filter).toStrictEqual({
		operator: 'and',
		filters: [
			{
				property: 'title',
				filter
			}
		]
	});
});

it(`Should populate nested filter`, () => {
	const parent_filter: IViewFilter = {
		operator: 'and',
		filters: []
	};
	NotionFabricator.PopulateViewData.query2.filters(
		[
			{
				filter,
				children: [
					{
						filter,
						name: 'Text',
						type: 'text',
						filter_operator: 'or'
					}
				],
				name: 'Title',
				type: 'text'
			}
		],
		parent_filter.filters,
		schema_map
	);

	expect(parent_filter).toStrictEqual({
		operator: 'and',
		filters: [
			{
				filters: [
					{
						property: 'title',
						filter
					},
					{
						property: 'text',
						filter
					}
				],
				operator: 'and'
			}
		]
	});
});

it(`Should populate non nested filter when using position`, () => {
	const parent_filter: IViewFilter = {
		operator: 'and',
		filters: [
			{
				property: 'text',
				filter
			}
		]
	};

	NotionFabricator.PopulateViewData.query2.filters(
		[
			{
				filter,
				name: 'Title',
				type: 'text',
				position: 0
			}
		],
		parent_filter.filters,
		schema_map
	);

	expect(parent_filter).toStrictEqual({
		operator: 'and',
		filters: [
			{
				property: 'title',
				filter
			},
			{
				property: 'text',
				filter
			}
		]
	});
});

it(`Should throw an error if unknown property is referenced`, () => {
	expect(() =>
		NotionFabricator.PopulateViewData.query2.filters(
			[
				{
					filter,
					name: 'Texto',
					type: 'text'
				}
			],
			[],
			schema_map
		)
	).toThrow();
});
