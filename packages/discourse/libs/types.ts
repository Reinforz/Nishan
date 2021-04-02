import { IDiscussion, TTextFormat } from '@nishans/types';

export type ICommentCreateInput = { comment_id?: string; text: TTextFormat; discussion_id: string };
export type ICommentUpdateInput = { text?: TTextFormat };
export type IDiscussionUpdateInput = Partial<Pick<IDiscussion, 'context' | 'resolved'>>;
