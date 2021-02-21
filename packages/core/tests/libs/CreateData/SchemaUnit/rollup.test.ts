import { Queries } from '@nishans/endpoints';
import { generateSchemaMapFromCollectionSchema } from '@nishans/notion-formula';
import { Schema } from '@nishans/types';
import { rollup } from '../../../../libs/CreateData/SchemaUnit/rollup';
import { createDefaultCache } from '../../../utils/createDefaultCache';

describe('rollup', () => {
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

	describe('Work correctly', () => {
		describe('Collection exists in cache', () => {
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
					generateSchemaMapFromCollectionSchema(schema),
					{
						cache: {
							...createDefaultCache(),
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
					generateSchemaMapFromCollectionSchema(schema),
					{
						cache: {
							...createDefaultCache(),
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
					generateSchemaMapFromCollectionSchema(schema),
					{
						cache: {
							...createDefaultCache(),
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
					generateSchemaMapFromCollectionSchema(schema),
					{
						cache: {
							...createDefaultCache(),
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
					generateSchemaMapFromCollectionSchema(schema),
					{
						cache: {
							...createDefaultCache(),
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

		it(`Should work correctly (collection exists in db)`, async () => {
			const cache = createDefaultCache();

			jest.spyOn(Queries, 'syncRecordValues').mockImplementationOnce(async () => {
				return {
					recordMap: {
						collection: {
							target_collection_id: {
								role: 'editor',
								value: {
									schema: {
										title: {
											type: 'title',
											name: 'Title'
										}
									}
								}
							}
						}
					}
				} as any;
			});

			const generated_rollup_schema = await rollup(
				{
					type: 'rollup',
					collection_id: 'target_collection_id',
					name: 'Rollup Column',
					relation_property: 'Relation',
					target_property: 'Title',
					aggregation: 'average'
				},
				generateSchemaMapFromCollectionSchema(schema),
				{
					cache,
					token: 'token'
				}
			);

			expect(generated_rollup_schema).toStrictEqual({
				type: 'rollup',
				collection_id: 'target_collection_id',
				name: 'Rollup Column',
				relation_property: 'relation',
				target_property: 'title',
				target_property_type: 'title',
				aggregation: 'average'
			});

			expect(cache.collection.get('target_collection_id')).toStrictEqual({
				schema: {
					title: {
						type: 'title',
						name: 'Title'
					}
				}
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
					generateSchemaMapFromCollectionSchema(schema),
					{
						cache: createDefaultCache(),
						token: 'token'
					}
				)
			).rejects.toThrow(`Unknown property unknown referenced in relation_property`);
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
					generateSchemaMapFromCollectionSchema(schema),
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
			).rejects.toThrow(`Unknown property unknown referenced in target_property`);
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
					generateSchemaMapFromCollectionSchema(schema),
					{
						cache: createDefaultCache(),
						token: 'token'
					}
				)
			).rejects.toThrow(
				`Property Title referenced in relation_property is not of the supported types\nGiven type: title\nSupported types: relation`
			);
		});

		it(`Should throw error if collection doesnt exist in cache and db`, async () => {
			jest.spyOn(Queries, 'syncRecordValues').mockImplementationOnce(async () => {
				return {
					recordMap: {
						collection: {
							target_collection_id: {
								role: 'editor'
							}
						}
					}
				} as any;
			});

			await expect(
				rollup(
					{
						type: 'rollup',
						collection_id: 'target_collection_id',
						name: 'Rollup Column',
						relation_property: 'Relation',
						target_property: 'unknown'
					},
					generateSchemaMapFromCollectionSchema(schema),
					{
						cache: createDefaultCache(),
						token: 'token'
					}
				)
			).rejects.toThrow(`Collection:target_collection_id doesnot exist`);
		});
	});
});
