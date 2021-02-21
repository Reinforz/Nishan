import { Operation } from '@nishans/operations';
import { TData } from '@nishans/types';
import { deepMerge } from '..';
import { IterateAndUpdateChildrenOptions, UpdateTypes } from '../../src';
import { iterateChildren, updateLastEditedProps } from './utils';

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
			stack,
			parent_type
		} = options,
		// get the data from the cache
		data = cache[parent_type].get(parent_id) as T,
		// Get the child ids array
		child_ids = (Array.isArray(options.child_ids) ? options.child_ids : data[options.child_ids]) as string[],
		last_updated_props = {
			last_edited_time: Date.now(),
			last_edited_by_table: 'notion_user',
			last_edited_by_id: user_id
		};

	const iterateUtil = async (child_id: string, child_data: CD, updated_data: RD) => {
		cb && (await cb(child_id, child_data, updated_data, container));
		logger && logger('UPDATE', child_type, child_id);

		if (!manual) {
			// If data update is not manual
			// 1. Update the last edited props of the data
			// 2. deeply merge the new data with the existing data
			// 3. Push the updated properties to the stack
			updateLastEditedProps(child_data, user_id);
			deepMerge(child_data, updated_data);
			stack.push(Operation[child_type].update(child_id, [], { ...updated_data, ...last_updated_props }));
		}
	};

	await iterateChildren<CD, RD>({ args, cb: iterateUtil, method: 'UPDATE' }, transform, {
		child_ids,
		multiple,
		child_type,
		parent_id,
		parent_type
	});

	// if parent data exists, update the last_edited_props for the cache and push to stack
	if (data) {
		updateLastEditedProps(data, user_id);
		stack.push(Operation[parent_type].update(parent_id, [], { ...last_updated_props }));
	}

	return container as C;
};
