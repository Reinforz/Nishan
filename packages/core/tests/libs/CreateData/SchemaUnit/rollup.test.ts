import { NotionCacheObject } from '@nishans/cache';
import { generateSchemaMapFromCollectionSchema } from '@nishans/notion-formula';
import { Schema } from '@nishans/types';
import { CreateData } from '../../../../libs';
import { tsu } from '../utils';

const schema: Schema = {
	title: tsu,
	relation: {
		type: 'relation',
		collection_id: 'target_collection_id',
		name: 'Relation',
		property: 'child_relation_property'
	}
};

const schema_map = generateSchemaMapFromCollectionSchema(schema);

it(`Should work correctly for target_property=title`, async () => {
	const logger = jest.fn(),
		rollup_arg = {
			collection_id: 'target_collection_id',
			name: 'Rollup Column',
			relation_property: 'Relation',
			target_property: 'Title',
			aggregation: 'average'
		} as any;
	const generated_rollup_schema = await CreateData.schema_unit.rollup(rollup_arg, schema_map, {
		cache: {
			...NotionCacheObject.createDefaultCache(),
			collection: new Map([
				[
					'target_collection_id',
					{
						schema: {
							title: tsu
						}
					} as any
				]
			])
		},
		token: 'token',
		logger
	});

	expect(logger).toHaveBeenCalledWith('READ', 'collection', 'target_collection_id');

	expect(generated_rollup_schema).toStrictEqual({
		...rollup_arg,
		type: 'rollup',
		relation_property: 'relation',
		target_property: 'title',
		target_property_type: 'title'
	});
});

describe('Throw errors', () => {
	it(`Should throw for using unknown relation_property`, async () => {
		await expect(
			CreateData.schema_unit.rollup(
				{
					collection_id: 'target_collection_id',
					name: 'Rollup Column',
					relation_property: 'unknown',
					target_property: 'unknown'
				},
				schema_map,
				{
					cache: NotionCacheObject.createDefaultCache(),
					token: 'token'
				}
			)
		).rejects.toThrow();
	});

	it(`Should throw for using unknown target_property`, async () => {
		await expect(
			CreateData.schema_unit.rollup(
				{
					collection_id: 'target_collection_id',
					name: 'Rollup Column',
					relation_property: 'Relation',
					target_property: 'unknown'
				},
				schema_map,
				{
					cache: {
						collection: new Map([
							[
								'target_collection_id',
								{
									schema: {
										title: tsu
									}
								}
							]
						])
					} as any,
					token: 'token'
				}
			)
		).rejects.toThrow();
	});

	it(`Should throw error if relation property is not relation type`, async () => {
		await expect(
			CreateData.schema_unit.rollup(
				{
					collection_id: 'target_collection_id',
					name: 'Rollup Column',
					relation_property: 'Title',
					target_property: 'unknown'
				},
				schema_map,
				{
					cache: NotionCacheObject.createDefaultCache(),
					token: 'token'
				}
			)
		).rejects.toThrow();
	});
});
