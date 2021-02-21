import { Operation } from '@nishans/operations';
import { IOperation, TData, TDataType } from '@nishans/types';

/**
 * Update the operation stack and parent's child container by either removing or adding the it based on the `keep` parameter
 * @param parent_data The parent data
 * @param keep Boolean indicating or not to keep the child id
 * @param child_id The child id
 * @param child_path The child path, ie the key in the parent_data that stores the child ids
 * @param stack Stack where to push the operation to
 * @param parent_type The parent data type
 */
export function updateChildContainer<T extends TData> (
	parent_data: T,
	keep: boolean,
	child_id: string,
	child_path: keyof T & string,
	stack: IOperation[],
	parent_type: TDataType
) {
	// Extract the child container from the parent using child_path
	const container = (parent_data[child_path] as unknown) as string[];
	// If the child container contains the child and it should not be kept
	// 1. Remove the child id from the child container
	// 2. Push to corresponding operation to the passed stack
	if (!keep && container.includes(child_id)) {
		parent_data[child_path] = container.filter((page_id) => page_id !== child_id) as any;
		stack.push(
			Operation[parent_type].listRemove(parent_data.id, [ child_path ], {
				id: child_id
			})
		);
	} else if (keep && !container.includes(child_id)) {
		// If the child container doesn't contains the child and it should be kept
		// 1. Add the child id to the child container
		// 2. Push to corresponding operation to the passed stack
		container.push(child_id);
		stack.push(
			Operation[parent_type].listAfter(parent_data.id, [ child_path ], {
				id: child_id
			})
		);
	}
}
