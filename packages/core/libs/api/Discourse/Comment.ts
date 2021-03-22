import { IComment } from '@nishans/types';
import { INotionCoreOptions } from '../..';
import NotionData from '../Data';

export class Comment extends NotionData<IComment> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg, type: 'comment' });
	}
}
