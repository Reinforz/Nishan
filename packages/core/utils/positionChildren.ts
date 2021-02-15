import { IOperation, TData, TDataType } from '@nishans/types';
import { Operation } from '@nishans/operations';
import { Logger, RepositionParams } from '../types';
import { detectChildData } from './detectChildData';

interface PositionChildrenParam {
	logger?: Logger;
	parent: TData;
	child_id: string;
	position?: RepositionParams;
	parent_type: TDataType;
}

export function positionChildren (arg: PositionChildrenParam) {
	const { child_id, position, parent_type, logger } = arg;
	const parent: any = arg.parent;
	const child_path: any = detectChildData(parent_type as any, parent as any)[0],
		contains_container = parent[child_path];
	if (!contains_container) parent[child_path] = [];
	const container: string[] = parent[child_path];
	logger && logger('UPDATE', parent_type, parent.id);

	if (position !== undefined && position !== null) {
		let where: 'Before' | 'After' = 'Before',
			id: string | undefined = '';
		if (typeof position === 'number') {
			id = !contains_container ? '' : container[position];
			container.splice(position, 0, child_id);
			if ((!contains_container && position !== 0) || id === undefined || id === null)
				throw new Error(`Parent doesnot contain any children at index ${position}`);
			where = contains_container ? 'Before' : 'After';
		} else {
			where = position.position;
			const pivot_index = container.indexOf(position.id);
			id = pivot_index !== -1 ? container[pivot_index] : undefined;
			container.splice(pivot_index + (position.position === 'Before' ? 0 : 1), 0, child_id);
			if (!id) throw new Error(`Parent doesnot contain any children with id ${position.id}`);
		}

		return (Operation[parent_type] as any)[`list${where}`](parent.id, [ child_path ], {
			[where.toLowerCase()]: id,
			id: child_id
		}) as IOperation;
	} else {
		container.push(child_id);
		return Operation[parent_type].listAfter(parent.id, [ child_path ], {
			after: '',
			id: child_id
		}) as IOperation;
	}
}
