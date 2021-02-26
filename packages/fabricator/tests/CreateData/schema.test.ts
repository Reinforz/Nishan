import { NotionCacheObject } from '@nishans/cache';
import { default_nishan_arg } from '../../../core/tests/utils';
import { CreateData } from '../../src';
import { TSchemaUnitInput } from '../../types';
import { tsu } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Work correctly', () => {
	it(`CreateData.schema should work correctly (collection exists in cache)`, async () => {
		const input_schema_units: TSchemaUnitInput[] = [
			tsu,
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
				name: 'Relation'
			}
		] as any;

		const cache = NotionCacheObject.createDefaultCache(),
			createSchemaUnitRollupMock = jest
				.spyOn(CreateData.schema_unit, 'rollup')
				.mockImplementationOnce(async () => input_schema_units[2] as any),
			createSchemaUnitRelationMock = jest
				.spyOn(CreateData.schema_unit, 'relation')
				.mockImplementationOnce(async () => input_schema_units[3] as any);

		const [ schema, schema_map ] = await CreateData.schema(input_schema_units, {
			...default_nishan_arg,
			parent_collection_id: 'parent_collection_id',
			name: [ [ 'Parent' ] ],
			cache,
			current_schema: {}
		});

		const output_schema_units = [
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

		expect(createSchemaUnitRollupMock).toHaveBeenCalledTimes(1);
		expect(createSchemaUnitRelationMock).toHaveBeenCalledTimes(1);
		expect(output_schema_units).toStrictEqual(Object.values(schema));
		expect(Array.from(schema_map.keys())).toStrictEqual([ 'Title', 'Formula', 'Rollup', 'Relation' ]);
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
