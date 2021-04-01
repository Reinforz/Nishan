import { ICommentCreateInput, NotionDiscourse } from '@nishans/discourse';
import { FilterType, FilterTypes } from '@nishans/traverser';
import { IComment, IDiscussion } from '@nishans/types';
import { INotionCoreOptions } from '../';
import { transformToMultiple } from '../utils';
import { Comment } from './Comment';
import NotionData from './Data';

export class Discussion extends NotionData<IDiscussion> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg, type: 'discussion' });
	}

	async createComments (args: Omit<ICommentCreateInput, 'discussion_id'>[]) {
		const props = this.getProps();
		return (await NotionDiscourse.Comments.create(args.map((arg) => ({ ...arg, discussion_id: this.id })), props)).map(
			(comment) => new Comment({ ...props, id: comment.id })
		);
	}

	async getComment (arg?: FilterType<IComment>) {
		return (await this.getComments(transformToMultiple(arg), false))[0];
	}

	async getComments (args?: FilterTypes<IComment>, multiple?: boolean) {
		const props = this.getProps();
		return (await NotionDiscourse.Comments.get(this.id, args, { ...props, multiple })).map(
			(comment) => new Comment({ ...props, id: comment.id })
		);
	}
}
