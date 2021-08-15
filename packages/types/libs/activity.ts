import { ParentProps, SpaceProps, TBlock } from './block';
import { IPermission } from './permissions';
import { IComment, INotionRecordMap } from './recordMap';
import { TSchemaUnitType } from './schema';
import { TView } from './view';

interface IEdit {
  space_id: string;
  authors: IEditAuthor[];
  timestamp: number;
}
export interface IEditAuthor {
  id: string;
  table: 'notion_user';
}

interface IBlockEdit<
  BD = {
    block_value: TBlock;
  }
> extends IEdit {
  block_id: string;
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

export type TBlockEdits =
  | IBlockCreatedEdit
  | IBlockChangedEdit
  | IBlockDeletedEdit;

interface IEmailChanged extends IEdit {
  type: 'email-changed';
  new_email: string;
  old_email: string;
}

export type TEmailEdits = IEmailChanged;

interface IPermissionEdit extends IEdit {
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

interface ICommentEdit extends IEdit {
  comment_id: string;
  discussion_id: string;
  navigable_block_id: string;
  permission_data: IPermission;
}

export interface ICommentCreatedEdit extends ICommentEdit {
  comment_data: IComment;
  type: 'comment-created';
}

export interface ICommentChangedEdit extends ICommentEdit {
  type: 'comment-changed';
  comment_data: {
    before: IComment;
    after: IComment;
  };
}

export interface ICommentDeletedEdit extends ICommentEdit {
  type: 'comment-deleted';
  comment_data: IComment;
}

export type TCommentEdits =
  | ICommentCreatedEdit
  | ICommentChangedEdit
  | ICommentDeletedEdit;

interface IActivity<E, T> extends ParentProps, SpaceProps {
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
  parent_table: 'block';
}

export interface ITopLevelBlockDeletedEdit extends IEdit {
  type: 'top-level-block-deleted';
  top_level_block_id: string;
}

export interface ITopLevelBlockCreatedEdit extends IEdit {
  type: 'top-level-block-created';
  top_level_block_id: string;
}

export interface ICollectionViewCreatedEdit extends IEdit {
  type: 'collection-view-created';
  block_schema: {
    [k: string]: {
      name: string;
      type: TSchemaUnitType;
    };
  };
  collection_id: string;
  collection_view_id: string;
  collection_block_id: string;
  collection_view_data: TView;
}
export interface ICollectionRowCreatedEdit extends IEdit {
  type: 'collection-row-created';
  collection_row_id: string;
  collection_id: string;
}

export interface IUserInvitedEdit extends IEdit {
  type: 'user-invited';
  invited_user_id: string;
  navigable_block_id: string;
}

export interface IMentionCreatedEdit extends IEdit {
  type: 'mention-created';
  navigable_block_id: string;
  mentioned_user_id: string;
  mentioned_block_id: string;
  mentioned_property: string;
}

export type IBlockEditedActivity = IActivity<TBlockEdits[], 'block-edited'> & {
  navigable_block_id: string;
};
export type IEmailEditedActivity = IActivity<TEmailEdits[], 'email-edited'>;
export type IPermissionEditedActivity = IActivity<
  TPermissionEdits[],
  'permission-edited'
>;
export type ICommentedActivity = IActivity<TCommentEdits[], 'commented'> & {
  navigable_block_id: string;
};
export type ITopLevelBlockDeletedActivity = IActivity<
  ITopLevelBlockDeletedEdit[],
  'top-level-block-deleted'
> & {
  top_level_block_id: string;
};
export type ITopLevelBlockCreatedActivity = IActivity<
  ITopLevelBlockCreatedEdit[],
  'top-level-block-created'
> & {
  top_level_block_id: string;
};
export type ICollectionViewCreatedActivity = IActivity<
  ICollectionViewCreatedEdit,
  'collection-view-created'
> & {
  collection_view_id: string;
  navigable_block_id: string;
  collection_id: string;
};
export type ICollectionRowCreatedActivity = IActivity<
  ICollectionRowCreatedEdit,
  'collection-row-created'
> & {
  collection_row_id: string;
  collection_id: string;
};
export type IUserInvitedActivity = IActivity<IUserInvitedEdit, 'user-invited'>;
export type IUserMentionedActivity = IActivity<
  IMentionCreatedEdit,
  'user-mentioned'
> & {
  navigable_block_id: string;
  mentioned_user_id: string;
  mentioned_block_id: string;
  mentioned_property: string;
};
export type TActivity =
  | IBlockEditedActivity
  | IEmailEditedActivity
  | IPermissionEditedActivity
  | ICommentedActivity
  | ITopLevelBlockDeletedActivity
  | ITopLevelBlockCreatedActivity
  | ICollectionViewCreatedActivity
  | ICollectionRowCreatedActivity
  | IUserInvitedActivity
  | IUserMentionedActivity;
export type IActivityRecordMap = INotionRecordMap<TActivity>;
