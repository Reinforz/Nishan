import { NotionLineage } from '@nishans/lineage';
import { NotionLogger } from '@nishans/logger';
import { NotionOperations } from '@nishans/operations';
import { IOperation, TData } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { FilterTypes, IterateAndDeleteChildrenOptions } from './types';
import { getChildIds, iterateChildren } from './utils';
/**
 * Iterates over the children of a parent and deletes it
 * @param args Array of ids or a cb passed with the transformed data
 * @param transform Cb to get the data using the id
 * @param options Options for delete function
 * @param cb additional callback
 */
export const remove = async <T extends TData, TD, C = any[]>(
	args: FilterTypes<TD>,
	transform: ((id: string) => TD | undefined | Promise<TD | undefined>),
	options: IterateAndDeleteChildrenOptions<T, C>,
	cb?: ((id: string, data: TD, container: C) => any)
) => {
	const {
			container,
			child_path,
			user_id,
			multiple = true,
			manual = false,
			parent_id,
			child_type,
			logger,
			cache,
			parent_type,
			child_ids
		} = options,
		// get the data from the cache
		parent_data = cache[parent_type].get(parent_id) as T,
		operations: IOperation[] = [];

	const updateData = async (child_id: string, child_data: TD) => {
		cb && (await cb(child_id, child_data, container));
		logger && NotionLogger.method.info(`DELETE ${child_type} ${child_id}`);

		let last_edited_props = {};
		if (!manual) {
			const updated_data: any = {};
			if (child_type.match(/^(block|space_view|collection_view|comment)$/)) updated_data.alive = false;

			if (child_type.match(/^(block|space|comment)$/))
				last_edited_props = NotionUtils.updateLastEditedProps(child_data, user_id);

			NotionUtils.deepMerge(child_data, updated_data);
			const updated_data_payload = { ...updated_data, ...last_edited_props };

			// Push the updated block data to the stack
			if (Object.keys(updated_data_payload).length)
				operations.push(
					NotionOperations.Chunk[child_type].update(child_id, [], { ...updated_data, ...last_edited_props })
				);

			if (typeof child_path === 'string')
				await NotionLineage.updateChildContainer<T>(parent_type, parent_id, false, child_id, child_path, options);
		}
	};

	await iterateChildren<TD, boolean>({ args, cb: updateData, method: 'DELETE' }, transform, {
		child_ids: getChildIds(child_ids, parent_data),
		multiple,
		child_type,
		parent_id,
		parent_type
	});

	// if parent data exists, update the last_edited_props for the cache and push to stack
	if (parent_type.match(/^(block|space|comment)$/))
		operations.push(
			NotionOperations.Chunk[parent_type].update(parent_id, [], NotionUtils.updateLastEditedProps(parent_data, user_id))
		);
	await NotionOperations.executeOperations(operations, options);
	return container;
};
