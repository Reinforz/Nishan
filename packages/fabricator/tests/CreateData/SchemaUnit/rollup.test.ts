import { NotionCache } from '@nishans/cache';
import { NotionLogger } from '@nishans/logger';
import { Schema } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { default_nishan_arg } from '../../../../core/tests/utils';
import { NotionFabricator } from '../../../libs';
import { tsu } from '../../utils';

const schema: Schema = {
	title: tsu,
	relation: {
		type: 'relation',
		collection_id: 'target_collection_id',
		name: 'Relation',
		property: 'child_relation_property'
	}
};

const schema_map = NotionUtils.generateSchemaMap(schema);

it(`Should work correctly for target_property=title`, async () => {
	const logger = jest.spyOn(NotionLogger.method, 'info').mockImplementationOnce(() => undefined as any),
		rollup_arg = {
			collection_id: 'target_collection_id',
			name: 'Rollup Column',
			relation_property: 'Relation',
			target_property: 'Title',
			aggregation: 'average'
		} as any;
	const generated_rollup_schema = await NotionFabricator.CreateData.SchemaUnit.rollup(rollup_arg, schema_map, {
		...default_nishan_arg,
		cache: {
			...NotionCache.createDefaultCache(),
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
		}
	});

	expect(logger).toHaveBeenCalledWith('READ collection target_collection_id');

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
			NotionFabricator.CreateData.SchemaUnit.rollup(
				{
					collection_id: 'target_collection_id',
					name: 'Rollup Column',
					relation_property: 'unknown',
					target_property: 'unknown'
				},
				schema_map,
				{
					user_id: 'user_root_1',
					cache: NotionCache.createDefaultCache(),
					token: 'token'
				}
			)
		).rejects.toThrow();
	});

	it(`Should throw error if relation property is not relation type`, async () => {
		await expect(
			NotionFabricator.CreateData.SchemaUnit.rollup(
				{
					collection_id: 'target_collection_id',
					name: 'Rollup Column',
					relation_property: 'Title',
					target_property: 'unknown'
				},
				schema_map,
				{
					user_id: 'user_root_1',
					cache: NotionCache.createDefaultCache(),
					token: 'token'
				}
			)
		).rejects.toThrow();
	});
});
