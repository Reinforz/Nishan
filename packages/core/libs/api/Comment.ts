import { ICommentUpdateInput } from '@nishans/discourse';
import { IComment } from '@nishans/types';
import { INotionCoreOptions } from '../';
import NotionData from './Data';

export default class Comment extends NotionData<IComment, ICommentUpdateInput> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg, type: 'comment' });
	}
}
