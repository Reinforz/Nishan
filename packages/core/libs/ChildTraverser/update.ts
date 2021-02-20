import { Operation } from '@nishans/operations';
import { TData } from '@nishans/types';
import { deepMerge } from '..';
import { IterateAndUpdateChildrenOptions, UpdateTypes } from '../../src';
import { iterateChildren, updateLastEditedProps } from './utils';

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
		data = cache[parent_type].get(parent_id) as T,
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

	if (data) {
		updateLastEditedProps(data, user_id);
		stack.push(Operation[parent_type].update(parent_id, [], { ...last_updated_props }));
	}

	return container as C;
};
