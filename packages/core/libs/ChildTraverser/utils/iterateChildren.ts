import { warn } from '@nishans/errors/src/logs';
import { TDataType } from '@nishans/types';
import { IterateChildren } from '../../../types';

export async function iterateChildren<TD, RD = any> (
	args: IterateChildren<TD, RD>,
	transform: ((id: string) => TD | undefined | Promise<TD | undefined>),
	{
		multiple = true,
		child_type,
		parent_type,
		parent_id,
		child_ids
	}: { child_ids: string[]; multiple?: boolean; child_type: TDataType; parent_type: TDataType; parent_id: string }
) {
	let total_matched = 0;
	if (Array.isArray(args.args)) {
		for (let index = 0; index < args.args.length; index++) {
			const child_id = args.method === 'UPDATE' ? args.args[index][0] : args.args[index],
				child_data = await transform(child_id),
				matches = child_ids.includes(child_id);

			if (!child_data) warn(`${child_type}:${child_id} does not exist in the cache`);
			if (!matches) warn(`${child_type}:${child_id} is not a child of ${parent_type}:${parent_id}`);

			if (child_data && matches) {
				total_matched++;
				if (args.method === 'UPDATE') await args.cb(child_id, child_data, args.args[index][1]);
				else await args.cb(child_id, child_data);
			}
			if (!multiple && total_matched === 1) break;
		}
	} else {
		for (let index = 0; index < child_ids.length; index++) {
			const child_id = child_ids[index],
				child_data = await transform(child_id);
			if (!child_data) warn(`${child_type}:${child_id} does not exist in the cache`);
			else {
				if (args.method === 'UPDATE') {
					const updated_data = args.args && (await args.args(child_data, index));
					if (child_data && updated_data) {
						total_matched++;
						await args.cb(child_id, child_data, updated_data);
					}
				} else {
					const matches = args.args && (await args.args(child_data, index));
					if (child_data && matches) {
						total_matched++;
						await args.cb(child_id, child_data);
					}
				}
			}
			if (!multiple && total_matched === 1) break;
		}
	}
}
