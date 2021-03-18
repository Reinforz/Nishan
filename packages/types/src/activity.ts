import { TBlock } from './block';
import { TPermissionRole } from './permissions';

interface IBlockEdit<
	BD = {
		'block_value': TBlock;
	}
> {
	'authors': [
		{
			'id': string;
			'table': 'notion_user';
		}
	];
	'block_id': string;
	'space_id': string;
	'timestamp': number;
	'block_data': BD;
	'navigable_block_id': string;
}

export interface IBlockCreatedEdit extends IBlockEdit {
	'type': 'block-created';
}

export interface IBlockDeletedEdit extends IBlockEdit {
	type: 'block-deleted';
}

export interface IBlockChangedEdit
	extends IBlockEdit<{
			after: {
				block_value: TBlock;
			};
			before: {
				block_value: TBlock;
			};
		}> {
	type: 'block-changed';
}

export type TBlockEdits = IBlockCreatedEdit | IBlockDeletedEdit;

interface IActivity<V> {
	[k: string]: {
		role: TPermissionRole;
		value: V;
	};
}

export type IBlockEditedActivity = IActivity<{
	'id': string;
	'version': number;
	'index': number;
	'type': 'block-edited';
	'parent_table': string;
	'parent_id': string;
	'start_time': string;
	'end_time': string;
	'invalid': boolean;
	'space_id': string;
	'navigable_block_id': string;
	'edits': TBlockEdits[];
	'shard_id': number;
	'context_id': string;
	'in_log': boolean;
}>;

export type TActivity = IBlockEditedActivity;
