import { NotionErrors } from '@nishans/errors';
import { NotionLogger } from '@nishans/logger';
import { NotionOperations } from '@nishans/operations';
import { IOperation, TData, TDataType } from '@nishans/types';
import { INotionRepositionParams } from './';

interface PositionChildrenParam {
	logger?: boolean;
	parent: TData;
	child_id: string;
	position?: INotionRepositionParams;
	parent_type: TDataType;
}

/**
 * Positions a child of a parent based on the passed argument
 * @param arg Data containing Child position information
 */
export function positionChildren<T extends TData> (child_path: keyof T, arg: PositionChildrenParam) {
	const { child_id, position, parent_type, logger } = arg;
	const parent: any = arg.parent;
	// Get the child path based on the parent type
	const contains_container = parent[child_path];
	// If the parent doesn't contain the child container create one
	if (!contains_container) parent[child_path] = [];
	const container: string[] = parent[child_path];
	logger && NotionLogger.method.info(`UPDATE ${parent_type} ${parent.id}`);

	if (position !== undefined && position !== null) {
		// Where should the new child_id be placed in reference to the pivot id
		let where: 'Before' | 'After' = 'Before',
			// The id based on which the current child_id will be positioned
			pivot_id: string | undefined = '';

		if (typeof position === 'number') {
			// pivot_id will be empty, if the container to store children doesn't exist, else it'd be the id at index of position
			pivot_id = !contains_container ? '' : container[position];
			// Push the child_id in position, shifting the one currently there to the right
			container.splice(position, 0, child_id);
			// IF the container doesn't exist and position is not zero or if the pivot_id is undefined or null, which could be the case if the position is outta index, throw an error
			if ((!contains_container && position !== 0) || pivot_id === undefined || pivot_id === null)
				throw new NotionErrors.child_index_out_of_bound(position, container.length, child_path as string);
			// If the container exists make where to be Before, reason is that, it should be occupying the index of the pivot_id
			// else make if after, ie push to last since its the first and only element
			where = contains_container ? 'Before' : 'After';
		} else {
			// When Position is not a number, where it given by the user
			where = position.position;
			// The pivot_index contains the index of the pivot_id
			const pivot_index = container.indexOf(position.id);
			// IF the pivot_index is not -1, then use that index in the container to get it pivot_id
			pivot_id = pivot_index !== -1 ? container[pivot_index] : undefined;
			// Throw and error if the pivot_id doesn't exist, since it means that the container doesn't have a child with the given id
			if (!pivot_id) throw new Error(`Parent doesn't contain any children with id ${position.id}`);
			// Else update the cached container, and based on the reference direction, calculate the splice index
			container.splice(pivot_index + (position.position === 'Before' ? 0 : 1), 0, child_id);
		}
		// Returns the appropriate operation for positioning the child, based on the where and the id
		return (NotionOperations.Chunk[parent_type] as any)[`list${where}`](parent.id, [ child_path ], {
			[where.toLowerCase()]: pivot_id,
			id: child_id
		}) as IOperation;
	} else {
		// If the passed position is undefined or null, its pushed to the last
		container.push(child_id);
		// Returns the appropriate operation for positioning the child
		return NotionOperations.Chunk[parent_type].listAfter(parent.id, [ child_path as string ], {
			after: '',
			id: child_id
		}) as IOperation;
	}
}
