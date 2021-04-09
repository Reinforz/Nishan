import { IDiscussion, TTextFormat } from '@nishans/types';

export type ICommentCreateInput = { id?: string; text: TTextFormat };
export type ICommentUpdateInput = { text?: TTextFormat };
export type IDiscussionUpdateInput = Partial<Pick<IDiscussion, 'context' | 'resolved'>>;
export type IDiscussionCreateInput = {
	context?: TTextFormat;
	id?: string;
	comments: ICommentCreateInput[];
	resolved?: boolean;
};
