import { NotionCacheObject } from '@nishans/cache';
import { generateSchemaMapFromCollectionSchema } from '@nishans/notion-formula';
import { ICollection, TSchemaUnit } from '@nishans/types';
import { CreateData } from '../../../libs/CreateData';
import { ISchemaMapValue, TSchemaUnitInput } from '../../../types';
import { default_nishan_arg } from '../../utils';
import { tsu } from './utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Work correctly', () => {
	it(`CreateData.schema should work correctly (collection exists in cache)`, async () => {
		const input_schema_units: TSchemaUnitInput[] = [
			{
				type: 'title',
				name: 'Title'
			},
			{
				type: 'number',
				name: 'Number'
			},
			{
				type: 'formula',
				name: 'Formula',
				formula: [ 'now()', 'string' ]
			},
			{
				type: 'relation',
				collection_id: 'child_collection_id',
				name: 'Parent Relation Column'
			},
			{
				type: 'rollup',
				collection_id: 'target_collection_id',
				name: 'Rollup',
				relation_property: 'Parent Relation Column',
				target_property: 'Title'
			}
		];

		const child_collection: ICollection = {
				schema: {
					title: {
						type: 'title',
						name: 'Title'
					}
				},
				name: 'Child',
				id: 'child_collection_id'
			} as any,
			target_collection: ICollection = {
				schema: {
					title: {
						type: 'title',
						name: 'Title'
					}
				},
				name: 'Target Collection',
				id: 'target_collection_id'
			} as any,
			cache = {
				...NotionCacheObject.createDefaultCache(),
				collection: new Map([
					[ 'child_collection_id', child_collection ],
					[ 'target_collection_id', target_collection ]
				])
			};

		const [ schema, schema_map, schema_unit_map ] = await CreateData.schema(input_schema_units, {
			...default_nishan_arg,
			parent_collection_id: 'parent_collection_id',
			name: [ [ 'Parent' ] ],
			cache,
			token: 'token',
			current_schema: {}
		});

		const child_relation_schema_unit_id = (generateSchemaMapFromCollectionSchema(child_collection.schema).get(
			'Related to Parent (Parent Relation Column)'
		) as ISchemaMapValue).schema_id;
		const parent_relation_schema_unit_id = (generateSchemaMapFromCollectionSchema(schema).get(
			'Parent Relation Column'
		) as ISchemaMapValue).schema_id;

		const output_schema_units = [
			{
				type: 'title',
				name: 'Title'
			},
			{
				type: 'number',
				name: 'Number'
			},
			{
				type: 'formula',
				name: 'Formula',
				formula: {
					result_type: 'date',
					name: 'now',
					type: 'function'
				}
			},
			{
				type: 'relation',
				collection_id: 'child_collection_id',
				name: 'Parent Relation Column',
				property: child_relation_schema_unit_id
			},
			{
				type: 'rollup',
				collection_id: 'target_collection_id',
				name: 'Rollup',
				relation_property: parent_relation_schema_unit_id,
				target_property: 'title',
				target_property_type: 'title',
				aggregation: undefined
			}
		] as TSchemaUnit[];

		expect(output_schema_units).toStrictEqual(Object.values(schema));

		expect(Array.from(schema_map.keys())).toStrictEqual([
			'Title',
			'Number',
			'Formula',
			'Parent Relation Column',
			'Rollup'
		]);
		expect(schema_unit_map.title.get('Title')).not.toBeUndefined();
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
