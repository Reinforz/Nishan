import { Queries } from '@nishans/endpoints';
import { UnknownPropertyReferenceError, UnsupportedPropertyTypeError } from '@nishans/errors';
import { formulateResultTypeFromSchemaType } from '@nishans/notion-formula';
import { RollupSchemaUnit, SyncRecordValuesParams } from '@nishans/types';
import { populateSchemaMap } from '../../../libs';
import { ISchemaMap, TRollupSchemaUnitInput } from '../../../types';
import { ParentCollectionData } from '../types';

/**
 * 
 * @param input_schema_unit The rollup schema unit input
 * @param schema_map The schema map used for resolving property reference
 * @param request_config The config object used to make reqest, validate and cache response
 * @return The newly constructed rollup schema unit
 */
export async function rollup (
	{ aggregation, name, collection_id, relation_property, target_property }: TRollupSchemaUnitInput,
	schema_map: ISchemaMap,
	request_config: Omit<
		ParentCollectionData,
		'parent_collection_id' | 'name' | 'parent_relation_schema_unit_id' | 'stack'
	>
) {
	// Get the related schema unit from the passed schema map
	const relation_schema_unit = schema_map.get(relation_property);
	// If the passed schema map unit doesnot exist then throw a unknown property error
	if (!relation_schema_unit) throw new UnknownPropertyReferenceError(relation_property, [ 'relation_property' ]);
	// If the schema unit is not of type relation, throw an error as well since only relation schema units can be used in rollup schema unit
	if (relation_schema_unit.type !== 'relation')
		throw new UnsupportedPropertyTypeError(relation_property, [ 'relation_property' ], relation_schema_unit.type, [
			'relation'
		]);
	// Get the info required for making the request and store in cache
	const { cache, token, logger } = request_config;
	// Get the target collection from the passed cache
	let target_collection = cache.collection.get(collection_id);
	// Construct the rollup schema unit
	const rollup_schema_unit: RollupSchemaUnit = {
		// The related collection id
		collection_id,
		// The name of the related schema unit
		name,
		// The name of the related schema_unit
		relation_property: relation_schema_unit.schema_id,
		type: 'rollup',
		// The type of aggregation used in the schema_unit
		aggregation,
		// The name of the target schema_unit
		target_property,
		// The return type of the target schema unit
		target_property_type: 'title'
	};

	// If the target collection doesnot exist obtain it from notion's db
	if (!target_collection) {
		// Construct the reqest params used to obtain the target collection
		const sync_record_values_param: SyncRecordValuesParams = {
			requests: [
				{
					table: 'collection',
					id: collection_id,
					version: 0
				}
			]
		};

		// Get the record map from the response
		const { recordMap } = await Queries.syncRecordValues(sync_record_values_param, {
			token,
			interval: 0
		});

		// If the request responded with an empty value, throw an error warning the user that the collection doesnot exist
		if (!recordMap.collection[collection_id].value) throw new Error(`Collection:${collection_id} doesnot exist`);
		// Set the returned value from the response
		target_collection = recordMap.collection[collection_id].value;
		// Store the target collection value to the cache
		cache.collection.set(collection_id, target_collection);
	}

	// Log the collection read operation
	logger && logger('READ', 'collection', target_collection.id);
	const target_collection_schema_map = populateSchemaMap(target_collection.schema);
	// Get the target collection schema unit map from the target collection schema map using the passed target property
	const target_collection_schema_unit_map = target_collection_schema_map.get(target_property);
	// The target collection schema unit map doesnot exist throw an error
	if (!target_collection_schema_unit_map)
		throw new UnknownPropertyReferenceError(target_property, [ 'target_property' ]);

	// Set the correct data to the previously constructed rollup schema unit
	rollup_schema_unit.target_property = target_collection_schema_unit_map.schema_id;
	rollup_schema_unit.target_property_type =
		// If the target property is of type title keep title
		target_collection_schema_unit_map.type === 'title'
			? 'title'
			: // Else if its of type formula, use the formula's result_type
				target_collection_schema_unit_map.type === 'formula'
				? target_collection_schema_unit_map.formula.result_type
				: // Else if its of type rollup
					target_collection_schema_unit_map.type === 'rollup'
					? // f the target property is of type title keep title
						target_collection_schema_unit_map.target_property_type === 'title'
						? 'title'
						: // Else get it from the function
							formulateResultTypeFromSchemaType(target_collection_schema_unit_map.target_property_type)
					: formulateResultTypeFromSchemaType(target_collection_schema_unit_map.type);

	// Return the constructed rollup schema unit
	return rollup_schema_unit;
}
