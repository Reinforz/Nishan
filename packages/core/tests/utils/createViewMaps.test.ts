import { Schema } from '@nishans/types';
import { getAggregationsMap, getFiltersMap, getFormatPropertiesMap, getSchemaMap, getSortsMap } from '../../src';

const schema: Schema = {
	title: {
		type: 'title',
		name: 'Title'
	},
	number: {
		type: 'number',
		name: 'Number'
	},
	text: {
		type: 'text',
		name: 'Text'
	}
};

afterEach(() => {
	jest.restoreAllMocks();
});

describe('getSchemaMap', () => {
	it(`Should create correct schema map`, () => {
		const schema_map = getSchemaMap(schema);

		expect(Array.from(schema_map.entries())).toStrictEqual([
			[
				'Title',
				{
					schema_id: 'title',
					name: 'Title',
					type: 'title'
				}
			],
			[
				'Number',
				{
					schema_id: 'number',
					name: 'Number',
					type: 'number'
				}
			],
			[
				'Text',
				{
					schema_id: 'text',
					name: 'Text',
					type: 'text'
				}
			]
		]);
	});
});

describe('getAggregationsMap', () => {
	it(`Should throw an error if unknown property is referenced`, () => {
		expect(() =>
			getAggregationsMap(
				{
					query2: {
						aggregations: [
							{
								property: 'unknown',
								aggregator: 'count'
							}
						]
					}
				} as any,
				schema
			)
		).toThrow(`Unknown property unknown referenced`);
	});

	it(`Should create correct schema map`, () => {
		const [ aggregations_map ] = getAggregationsMap(
			{
				query2: {
					aggregations: [
						{
							property: 'title',
							aggregator: 'count'
						}
					]
				}
			} as any,
			schema
		);

		expect(Array.from(aggregations_map.entries())).toStrictEqual([
			[
				'Title',
				{
					schema_id: 'title',
					name: 'Title',
					type: 'title',
					aggregation: {
						aggregator: 'count',
						property: 'title'
					}
				}
			]
		]);
	});
});

describe('getSortsMap', () => {
	it(`Should throw error when unknown property is referenced`, () => {
		expect(() =>
			getSortsMap(
				{
					query2: {
						sort: [
							{
								property: 'unknown',
								direction: 'ascending'
							}
						]
					}
				} as any,
				schema
			)
		).toThrow(`Unknown property unknown referenced`);
	});

	it(`Should create correct schema map`, () => {
		const [ sorts_map ] = getSortsMap(
			{
				query2: {
					sort: [
						{
							property: 'title',
							direction: 'ascending'
						}
					]
				}
			} as any,
			schema
		);

		expect(Array.from(sorts_map.entries())).toStrictEqual([
			[
				'Title',
				{
					schema_id: 'title',
					name: 'Title',
					type: 'title',
					sort: 'ascending'
				}
			]
		]);
	});
});

describe('getFormatPropertiesMap', () => {
	it(`Should throw an error if unknown property is referenced`, () => {
		expect(() =>
			getFormatPropertiesMap(
				{
					type: 'table',
					format: {
						table_properties: [
							{
								width: 150,
								visible: false,
								property: 'unknown'
							}
						]
					}
				} as any,
				schema
			)
		).toThrow(`Unknown property unknown referenced`);
	});

	it(`Should create correct schema map`, () => {
		const [ format_map ] = getFormatPropertiesMap(
			{
				type: 'table',
				format: {
					table_properties: [
						{
							width: 150,
							visible: false,
							property: 'title'
						}
					]
				}
			} as any,
			schema
		);

		expect(Array.from(format_map.entries())).toStrictEqual([
			[
				'Title',
				{
					schema_id: 'title',
					name: 'Title',
					type: 'title',
					format: {
						width: 150,
						visible: false
					}
				}
			]
		]);
	});
});

describe('getFiltersMap', () => {
	it(`Should throw error for using unknown property`, () => {
		expect(() =>
			getFiltersMap(
				{
					query2: {
						filter: {
							operator: 'and',
							filters: [
								{
									property: 'unknown',
									filter: {
										operator: 'string_starts_with',
										value: {
											type: 'exact',
											value: '123'
										}
									}
								}
							]
						}
					}
				} as any,
				schema
			)
		).toThrow(`Unknown property unknown referenced`);
	});

	it(`Should create correct schema map`, () => {
		const filter0_0 = {
				property: 'title',
				filter: {
					operator: 'string_is',
					value: {
						type: 'exact',
						value: '123'
					}
				}
			},
			filter0_1 = {
				property: 'text',
				filter: {
					operator: 'string_contains',
					value: {
						type: 'exact',
						value: '123'
					}
				}
			},
			filter1 = {
				property: 'title',
				filter: {
					operator: 'string_starts_with',
					value: {
						type: 'exact',
						value: '123'
					}
				}
			},
			filter0 = {
				operator: 'or',
				filters: [ filter0_0, filter0_1 ]
			};

		const [ filters_map ] = getFiltersMap(
			{
				query2: {
					filter: {
						operator: 'and',
						filters: [ filter0, filter1 ]
					}
				}
			} as any,
			schema
		);

		expect(Array.from(filters_map.entries())).toStrictEqual([
			[
				'0.0',
				{
					schema_id: 'title',
					name: 'Title',
					type: 'title',
					parent_filter: filter0,
					child_filter: filter0_0
				}
			],
			[
				'0.1',
				{
					schema_id: 'text',
					name: 'Text',
					type: 'text',
					parent_filter: filter0,
					child_filter: filter0_1
				}
			],
			[
				'1',
				{
					schema_id: 'title',
					name: 'Title',
					type: 'title',
					parent_filter: {
						operator: 'and',
						filters: [ filter0, filter1 ]
					},
					child_filter: filter1
				}
			]
		]);
	});
});
