import { NotionCacheObject } from '@nishans/cache';
import { generateSchemaMapFromCollectionSchema } from '@nishans/notion-formula';
import { Schema } from '@nishans/types';
import { rollup } from '../../../../libs/CreateData/SchemaUnit/rollup';

const schema: Schema = {
	title: {
		type: 'title',
		name: 'Title'
	},
	relation: {
		type: 'relation',
		collection_id: 'target_collection_id',
		name: 'Relation',
		property: 'child_relation_property'
	}
};
const schema_map = generateSchemaMapFromCollectionSchema(schema);

describe('Work correctly', () => {
	it(`Should work correctly for target_property=title`, async () => {
		const generated_rollup_schema2 = await rollup(
			{
				type: 'rollup',
				collection_id: 'target_collection_id',
				name: 'Rollup Column',
				relation_property: 'Relation',
				target_property: 'Title',
				aggregation: 'average'
			},
			schema_map,
			{
				cache: {
					...NotionCacheObject.createDefaultCache(),
					collection: new Map([
						[
							'target_collection_id',
							{
								schema: {
									title: {
										type: 'title',
										name: 'Title'
									}
								}
							} as any
						]
					])
				},
				token: 'token',
				logger: () => {
					return;
				}
			}
		);

		expect(generated_rollup_schema2).toStrictEqual({
			type: 'rollup',
			collection_id: 'target_collection_id',
			name: 'Rollup Column',
			relation_property: 'relation',
			target_property: 'title',
			target_property_type: 'title',
			aggregation: 'average'
		});
	});

	it(`Should work correctly for target_property=text`, async () => {
		const generated_rollup_schema2 = await rollup(
			{
				type: 'rollup',
				collection_id: 'target_collection_id',
				name: 'Rollup Column',
				relation_property: 'Relation',
				target_property: 'Text',
				aggregation: 'average'
			},
			schema_map,
			{
				cache: {
					...NotionCacheObject.createDefaultCache(),
					collection: new Map([
						[
							'target_collection_id',
							{
								schema: {
									text: {
										type: 'text',
										name: 'Text'
									}
								}
							} as any
						]
					])
				},
				token: 'token',
				logger: () => {
					return;
				}
			}
		);

		expect(generated_rollup_schema2).toStrictEqual({
			type: 'rollup',
			collection_id: 'target_collection_id',
			name: 'Rollup Column',
			relation_property: 'relation',
			target_property: 'text',
			target_property_type: 'text',
			aggregation: 'average'
		});
	});

	it(`Should work correctly for target_property=rollup.title`, async () => {
		const generated_rollup_schema = await rollup(
			{
				type: 'rollup',
				collection_id: 'target_collection_id',
				name: 'Rollup Column',
				relation_property: 'Relation',
				target_property: 'Rollup',
				aggregation: 'average'
			},
			schema_map,
			{
				cache: {
					...NotionCacheObject.createDefaultCache(),
					collection: new Map([
						[
							'target_collection_id',
							{
								schema: {
									rollup: {
										name: 'Rollup',
										type: 'rollup',
										target_property_type: 'title'
									}
								}
							} as any
						]
					])
				},
				token: 'token',
				logger: () => {
					return;
				}
			}
		);

		expect(generated_rollup_schema).toStrictEqual({
			type: 'rollup',
			collection_id: 'target_collection_id',
			name: 'Rollup Column',
			relation_property: 'relation',
			target_property: 'rollup',
			target_property_type: 'title',
			aggregation: 'average'
		});
	});

	it(`Should work correctly for target_property=rollup.text`, async () => {
		const generated_rollup_schema = await rollup(
			{
				type: 'rollup',
				collection_id: 'target_collection_id',
				name: 'Rollup Column',
				relation_property: 'Relation',
				target_property: 'Rollup',
				aggregation: 'average'
			},
			schema_map,
			{
				cache: {
					...NotionCacheObject.createDefaultCache(),
					collection: new Map([
						[
							'target_collection_id',
							{
								schema: {
									rollup: {
										name: 'Rollup',
										type: 'rollup',
										target_property_type: 'text'
									}
								}
							} as any
						]
					])
				},
				token: 'token',
				logger: () => {
					return;
				}
			}
		);

		expect(generated_rollup_schema).toStrictEqual({
			type: 'rollup',
			collection_id: 'target_collection_id',
			name: 'Rollup Column',
			relation_property: 'relation',
			target_property: 'rollup',
			target_property_type: 'text',
			aggregation: 'average'
		});
	});

	it(`Should work correctly for target_property=formula.date`, async () => {
		const generated_rollup_schema = await rollup(
			{
				type: 'rollup',
				collection_id: 'target_collection_id',
				name: 'Rollup Column',
				relation_property: 'Relation',
				target_property: 'Formula',
				aggregation: 'average'
			},
			schema_map,
			{
				cache: {
					...NotionCacheObject.createDefaultCache(),
					collection: new Map([
						[
							'target_collection_id',
							{
								schema: {
									formula: {
										type: 'formula',
										name: 'Formula',
										formula: {
											result_type: 'date'
										}
									}
								}
							} as any
						]
					])
				},
				token: 'token',
				logger: () => {
					return;
				}
			}
		);

		expect(generated_rollup_schema).toStrictEqual({
			type: 'rollup',
			collection_id: 'target_collection_id',
			name: 'Rollup Column',
			relation_property: 'relation',
			target_property: 'formula',
			target_property_type: 'date',
			aggregation: 'average'
		});
	});
});

describe('Throw errors', () => {
	it(`Should throw for using unknown relation_property`, async () => {
		await expect(
			rollup(
				{
					type: 'rollup',
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
			rollup(
				{
					type: 'rollup',
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
										title: {
											type: 'title',
											name: 'Title'
										}
									}
								} as any
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
			rollup(
				{
					type: 'rollup',
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
