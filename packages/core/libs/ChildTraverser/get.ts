import { TData } from '@nishans/types';
import { FilterTypes, IterateAndGetChildrenOptions } from '../../src';
import { iterateChildren } from './utils/iterateChildren';

/**
 * Iterates over the children of a parent and retrieves it
 * @param args Array of ids or a cb passed with the transformed data
 * @param transform Cb to get the data using the id
 * @param options Options for get function
 * @param cb additional callback
 */
export const get = async <T extends TData, TD, C = any[]>(
	args: FilterTypes<TD>,
	transform: ((id: string) => TD | undefined | Promise<TD | undefined>),
	options: IterateAndGetChildrenOptions<T, C>,
	cb?: ((id: string, data: TD, container: C) => any)
) => {
	const { container, parent_id, multiple = true, child_type, logger, cache, parent_type } = options,
		// get the data from the cache
		parent = cache[parent_type].get(parent_id) as T,
		// Get the child ids array
		child_ids = (Array.isArray(options.child_ids) ? options.child_ids : parent[options.child_ids]) as string[];

	const iterateUtil = async (child_id: string, child_data: TD) => {
		cb && (await cb(child_id, child_data, container));
		logger && logger('READ', child_type, child_id);
	};

	await iterateChildren<TD, boolean>({ args, method: 'READ', cb: iterateUtil }, transform, {
		child_ids,
		multiple,
		child_type,
		parent_id,
		parent_type
	});

	return container;
};