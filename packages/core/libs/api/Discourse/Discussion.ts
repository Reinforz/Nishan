import { IDiscussion } from '@nishans/types';
import { INotionCoreOptions } from '../..';
import NotionData from '../Data';

export class Discussion extends NotionData<IDiscussion> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg, type: 'discussion' });
	}
}
