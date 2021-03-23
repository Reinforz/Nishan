import { NotionLogger } from '@nishans/logger';
import { NotionOperations } from '@nishans/operations';
import { IOperation, TData } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { IterateAndUpdateChildrenOptions, UpdateTypes } from './types';
import { getChildIds, iterateChildren } from './utils';

/**
 * Iterates over the children of a parent and updates it
 * @param args Array of id and updated_data tuple or a cb passed with the transformed data
 * @param transform Cb to get the data using the id
 * @param options Options for update function
 * @param cb additional callback
 */
export const update = async <T extends TData, CD, RD, C = any[]>(
	args: UpdateTypes<CD, RD>,
	transform: ((id: string) => CD | undefined | Promise<CD | undefined>),
	options: IterateAndUpdateChildrenOptions<T, C>,
	cb?: ((id: string, child_data: CD, updated_data: RD, container: C) => any)
) => {
	const {
			container,
			manual = false,
			user_id,
			parent_id,
			multiple = true,
			child_type,
			logger,
			cache,
			parent_type,
			child_ids
		} = options,
		parent_data = cache[parent_type].get(parent_id) as T,
		operations: IOperation[] = [];

	const iterateUtil = async (child_id: string, child_data: CD, updated_data: RD) => {
		cb && (await cb(child_id, child_data, updated_data, container));
		logger && NotionLogger.method.info(`UPDATE ${child_type} ${child_id}`);

		let last_edited_props = {};
		if (!manual) {
			// If data update is not manual
			// 1. Update the last edited props of the data
			// 2. deeply merge the new data with the existing data
			// 3. Push the updated properties to the stack

			if (child_type.match(/^(block|space|comment)$/))
				last_edited_props = NotionUtils.updateLastEditedProps(child_data, user_id);

			NotionUtils.deepMerge(child_data, updated_data);
			operations.push(
				NotionOperations.Chunk[child_type].update(child_id, [], { ...updated_data, ...last_edited_props })
			);
		}
	};

	await iterateChildren<CD, RD>({ args, cb: iterateUtil, method: 'UPDATE' }, transform, {
		child_ids: getChildIds(child_ids, parent_data),
		multiple,
		child_type,
		parent_id,
		parent_type
	});

	if (parent_type.match(/^(block|space|comment)$/))
		operations.push(
			NotionOperations.Chunk[parent_type].update(parent_id, [], NotionUtils.updateLastEditedProps(parent_data, user_id))
		);
	await NotionOperations.executeOperations(operations, options);
	return container as C;
};
