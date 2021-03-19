import { ParentProps, SpaceShardProps, TBlock } from './block';
import { IPermission, TPermissionRole } from './permissions';

export interface IEditAuthor {
	'id': string;
	'table': 'notion_user';
}

interface IBlockEdit<
	BD = {
		'block_value': TBlock;
	}
> {
	authors: IEditAuthor[];
	block_id: string;
	space_id: string;
	timestamp: number;
	block_data: BD;
	navigable_block_id: string;
}

export interface IBlockCreatedEdit extends IBlockEdit {
	type: 'block-created';
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

export type TBlockEdits = IBlockCreatedEdit | IBlockChangedEdit | IBlockDeletedEdit;

interface IEmailChanged {
	type: 'email-changed';
	authors: IEditAuthor;
	space_id: string;
	new_email: string;
	old_email: string;
	timestamp: number;
}

export type TEmailEdits = IEmailChanged;

interface IPermissionEdit {
	authors: IEditAuthor[];
	timestamp: string;
	space_id: string;
	navigable_block_id: string;
	permission_data: IPermission;
}

export interface IPermissionCreatedEdit extends IPermissionEdit {
	type: 'permission-created';
}
export interface IPermissionDeletedEdit extends IPermissionEdit {
	type: 'permission-deleted';
}

export type TPermissionEdits = IPermissionCreatedEdit | IPermissionDeletedEdit;

interface IActivity<E, T> extends ParentProps, SpaceShardProps {
	id: string;
	version: number;
	index: number;
	type: T;
	start_time: string;
	end_time: string;
	invalid: boolean;
	edits: E;
	context_id: string;
	in_log: boolean;
}

export type IBlockEditedActivity = IActivity<TBlockEdits[], 'block-edited'> & { navigable_block_id: string };
export type IEmailEditedActivity = IActivity<TEmailEdits[], 'email-edited'>;
export type IPermissionEditedActivity = IActivity<TPermissionEdits[], 'email-edited'>;

export type TActivity = {
	[k: string]: {
		role: TPermissionRole;
		value: IBlockEditedActivity | IEmailEditedActivity | IPermissionEditedActivity;
	};
};
