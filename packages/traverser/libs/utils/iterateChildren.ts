import { NotionLogger } from '@nishans/logger';
import { TDataType } from '@nishans/types';
import { IterateChildren } from '../types';

/**
 * Iterates over all the child of a parent, and uses a cb to pass them to the caller
 * @param args Array of ids or a cb based on the type of iteration
 * @param transform A cb that returns the data based on its id
 * @param options Options that contains information regarding the child and parent
 */
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
	// A flag to keep track of total matched data,
	// 1. data that exists in the cache
	// 2. Data that is included within the child ids array
	// Useful to break from iteration when multiple is false
	let total_matched = 0;
	if (Array.isArray(args.args)) {
		// If the argument is an array, iterate over all the elements
		for (let index = 0; index < args.args.length; index++) {
			// If the method is update, each item of the argument array is a tuple of [id, updated data], so to get the child id, get the first item
			// else its a string
			const child_id = args.method === 'UPDATE' ? args.args[index][0] : args.args[index],
				// get the child data using the transform cb passed, by passing it the obtained child id
				child_data = await transform(child_id),
				// The passed id might not be inside the original child container of the parent,
				matches = child_ids.includes(child_id);

			// if the child_data returned from the transform cb is falsy, it doesn't exist in the cache
			if (!child_data) NotionLogger.method.warn(`${child_type}:${child_id} does not exist in the cache`);
			// If matches is false, the child id is not included in the child container of the parent
			if (!matches) NotionLogger.method.warn(`${child_type}:${child_id} is not a child of ${parent_type}:${parent_id}`);

			// Only if the child data exists and its included in the child container
			if (child_data && matches) {
				// Increment the total matched, since it matches the criteria
				total_matched++;
				// If the method is update, call the cb passed by the caller, and pass the child_id, child data and the updated data
				if (args.method === 'UPDATE') await args.cb(child_id, child_data, args.args[index][1]);
				else
					// else call the cb passed by the caller, and pass the child_id, child data
					await args.cb(child_id, child_data);
			}
			if (!multiple && total_matched === 1) break;
		}
	} else {
		// Else the argument is a cb
		// Iterate through all the child_ids
		for (let index = 0; index < child_ids.length; index++) {
			const child_id = child_ids[index],
				// get the child data using the transform cb passed, by passing it the child id
				child_data = await transform(child_id);
			// If child_data doesn't exist then show a warning
			if (!child_data) NotionLogger.method.warn(`${child_type}:${child_id} does not exist in the cache`);
			else {
				if (args.method === 'UPDATE') {
					// Get the new updated data by passing the current data and the index
					const updated_data = args.args && (await args.args(child_data, index));
					// if the updated data and the current data exists
					if (child_data && updated_data) {
						// Increment the total matched, since it matches the criteria
						total_matched++;
						await args.cb(child_id, child_data, updated_data);
					}
				} else {
					// Else matches is a boolean, obtained by calling the actual cb argument
					const matches = args.args && (await args.args(child_data, index));
					if (child_data && matches) {
						total_matched++;
						await args.cb(child_id, child_data);
					}
				}
			}
			// If multiple is false, and total matched is 1 break the loop and proceed no further
			if (!multiple && total_matched === 1) break;
		}
	}
}
