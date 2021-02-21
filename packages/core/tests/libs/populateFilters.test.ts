import { generateSchemaMapFromCollectionSchema } from '@nishans/notion-formula';
import { IViewFilter } from '@nishans/types';
import { populateFilters } from '../../libs';

const schema_map = generateSchemaMapFromCollectionSchema({
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

describe('populateFilters', () => {
	it(`Should populate unnested filter`, () => {
		const parent_filter: IViewFilter = {
			operator: 'and',
			filters: []
		};

		populateFilters(
			[
				{
					filter: {
						operator: 'string_is',
						value: {
							type: 'exact',
							value: '123'
						}
					},
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
					filter: {
						operator: 'string_is',
						value: {
							type: 'exact',
							value: '123'
						}
					}
				}
			]
		});
	});

	it(`Should populate nested filter`, () => {
		const parent_filter: IViewFilter = {
			operator: 'and',
			filters: []
		};
		populateFilters(
			[
				{
					filter: {
						operator: 'string_is',
						value: {
							type: 'exact',
							value: '123'
						}
					},
					children: [
						{
							filter: {
								operator: 'string_contains',
								value: {
									type: 'exact',
									value: '123'
								}
							},
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
							filter: {
								operator: 'string_is',
								value: {
									type: 'exact',
									value: '123'
								}
							}
						},
						{
							property: 'text',
							filter: {
								operator: 'string_contains',
								value: {
									type: 'exact',
									value: '123'
								}
							}
						}
					],
					operator: 'and'
				}
			]
		});
	});

	it(`Should populate unnested filter when using position`, () => {
		const parent_filter: IViewFilter = {
			operator: 'and',
			filters: [
				{
					property: 'text',
					filter: {
						operator: 'string_is',
						value: {
							type: 'exact',
							value: '123'
						}
					}
				}
			]
		};

		populateFilters(
			[
				{
					filter: {
						operator: 'string_is',
						value: {
							type: 'exact',
							value: '123'
						}
					},
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
					filter: {
						operator: 'string_is',
						value: {
							type: 'exact',
							value: '123'
						}
					}
				},
				{
					property: 'text',
					filter: {
						operator: 'string_is',
						value: {
							type: 'exact',
							value: '123'
						}
					}
				}
			]
		});
	});

	it(`Should throw an error if unknown property is referenced`, () => {
		expect(() =>
			populateFilters(
				[
					{
						filter: {
							operator: 'string_is',
							value: {
								type: 'exact',
								value: '123'
							}
						},
						name: 'Texto',
						type: 'text'
					}
				],
				[],
				schema_map
			)
		).toThrow();
	});
});
