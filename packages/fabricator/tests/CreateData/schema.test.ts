import { NotionCacheObject } from '@nishans/cache';
import { default_nishan_arg } from '../../../core/tests/utils';
import { CreateData } from '../../libs';
import { TSchemaUnitInput } from '../../types';
import { tsu } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Work correctly', () => {
	it(`CreateData.schema should work correctly (custom input)`, async () => {
		const input_schema_units: TSchemaUnitInput[] = [
			{
				type: 'formula',
				name: 'Formula',
				formula: [ 'now()', 'string' ]
			},
			{
				type: 'rollup',
				name: 'Rollup'
			},
			{
				type: 'relation',
				name: 'Relation',
				property_visibility: 'hide'
			}
		] as any;

		const cb = jest.fn(),
			cache = NotionCacheObject.createDefaultCache(),
			createSchemaUnitRollupMock = jest
				.spyOn(CreateData.schema_unit, 'rollup')
				.mockImplementationOnce(async () => input_schema_units[2] as any),
			createSchemaUnitRelationMock = jest
				.spyOn(CreateData.schema_unit, 'relation')
				.mockImplementationOnce(async () => input_schema_units[3] as any);
		const output_schema_values = [
			tsu,
			{
				type: 'formula',
				name: 'Formula',
				formula: {
					result_type: 'date',
					name: 'now',
					type: 'function'
				}
			},
			input_schema_units[2],
			input_schema_units[3]
		];

		const [ schema, schema_map, collection_format ] = await CreateData.schema(
			input_schema_units,
			{
				...default_nishan_arg,
				parent_collection_id: 'parent_collection_id',
				name: [ [ 'Parent' ] ],
				cache,
				current_schema: {
					title: tsu
				}
			},
			cb
		);

		expect(createSchemaUnitRollupMock).toHaveBeenCalledTimes(1);
		expect(createSchemaUnitRelationMock).toHaveBeenCalledTimes(1);
		expect(cb).toHaveBeenCalledTimes(3);
		expect(cb.mock.calls[0][0]).toStrictEqual(expect.objectContaining(output_schema_values[1]));
		expect(Object.values(schema)).toStrictEqual(output_schema_values);
		expect(Array.from(schema_map.keys())).toStrictEqual([ 'Title', 'Formula', 'Rollup', 'Relation' ]);
		expect(collection_format).toStrictEqual({
			property_visibility: [
				{
					property: expect.any(String),
					visibility: 'hide'
				}
			]
		});
	});

	it(`CreateData.schema should work correctly (default input)`, async () => {
		const cache = NotionCacheObject.createDefaultCache();
		const [ schema, schema_map, collection_format ] = await CreateData.schema([ tsu ], {
			...default_nishan_arg,
			parent_collection_id: 'parent_collection_id',
			name: [ [ 'Parent' ] ],
			cache
		});

		expect(Object.values(schema)).toStrictEqual([ tsu ]);
		expect(Array.from(schema_map.keys())).toStrictEqual([ 'Title' ]);
		expect(collection_format).toStrictEqual({
			property_visibility: []
		});
	});
});

describe('Throws error', () => {
	it(`Should throw error for duplicate property name`, () => {
		expect(() =>
			CreateData.schema([ tsu, tsu ], {
				...default_nishan_arg,
				parent_collection_id: 'parent_collection_id',
				name: [ [ 'Parent' ] ]
			})
		).rejects.toThrow();
	});

	it(`Should throw error if title type property not present in schema`, () => {
		expect(() =>
			CreateData.schema(
				[
					{
						type: 'number',
						name: 'Number'
					}
				],
				{
					...default_nishan_arg,
					parent_collection_id: 'parent_collection_id',
					name: [ [ 'Parent' ] ]
				}
			)
		).rejects.toThrow();
	});
});
