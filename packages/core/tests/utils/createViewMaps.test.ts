import { Schema } from '@nishans/types';
import deepEqual from 'deep-equal';
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

describe('getSchemaMap', () => {
	it(`Should create correct schema map`, () => {
		const schema_map = getSchemaMap(schema);

		expect(
			deepEqual(Array.from(schema_map.entries()), [
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
			])
		).toBe(true);
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

		expect(
			deepEqual(Array.from(aggregations_map.entries()), [
				[
					'Title',
					{
						schema_id: 'title',
						name: 'Title',
						type: 'title',
						aggregation: 'count'
					}
				]
			])
		).toBe(true);
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

		expect(
			deepEqual(Array.from(sorts_map.entries()), [
				[
					'Title',
					{
						schema_id: 'title',
						name: 'Title',
						type: 'title',
						sort: 'ascending'
					}
				]
			])
		).toBe(true);
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

		expect(
			deepEqual(Array.from(format_map.entries()), [
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
			])
		).toBe(true);
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
		const [ filters_map ] = getFiltersMap(
			{
				query2: {
					filter: {
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
								operator: 'or'
							},
							{
								property: 'title',
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
		);

		expect(
			deepEqual(Array.from(filters_map.entries()), [
				[
					'Title',
					{
						schema_id: 'title',
						name: 'Title',
						type: 'title',
						filters: [
							{
								operator: 'string_is',
								value: {
									type: 'exact',
									value: '123'
								}
							},
							{
								operator: 'string_starts_with',
								value: {
									type: 'exact',
									value: '123'
								}
							}
						]
					}
				],
				[
					'Text',
					{
						schema_id: 'text',
						name: 'Text',
						type: 'text',
						filters: [
							{
								operator: 'string_contains',
								value: {
									type: 'exact',
									value: '123'
								}
							}
						]
					}
				]
			])
		).toBe(true);
	});
});
