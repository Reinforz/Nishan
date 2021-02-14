import { IUserRoot, ISpaceView } from '@nishans/types';
import { transformToMultiple } from '../utils';
import { NishanArg, FilterType, FilterTypes, UpdateType, ISpaceViewUpdateInput, UpdateTypes } from '../types';
import Data from './Data';

import SpaceView from './SpaceView';

class UserRoot extends Data<IUserRoot> {
	constructor (arg: NishanArg) {
		super({ ...arg, type: 'user_root' });
	}

	/**
   * Get a single space view from the user root
   * @param arg criteria to filter pages by
   * @returns A page object matching the passed criteria
   */
	async getSpaceView (arg?: FilterType<ISpaceView>) {
		return (await this.getSpaceViews(transformToMultiple(arg), false))[0];
	}

	/**
   * Get multiple Space views from the user root
   * @param arg criteria to filter pages by
   * @returns An array of pages object matching the passed criteria
   */
	async getSpaceViews (args?: FilterTypes<ISpaceView>, multiple?: boolean) {
		return await this.getIterate<ISpaceView, SpaceView[]>(
			args,
			{ multiple, child_type: 'space_view', child_ids: 'space_views', container: [] },
			(space_id) => this.cache.space_view.get(space_id),
			(id, _, container) =>
				container.push(
					new SpaceView({
						...this.getProps(),
						id
					})
				)
		);
	}

	async updateSpaceView (arg: UpdateType<ISpaceView, ISpaceViewUpdateInput>) {
		return (await this.updateSpaceViews(transformToMultiple(arg), false))[0];
	}

	async updateSpaceViews (args: UpdateTypes<ISpaceView, ISpaceViewUpdateInput>, multiple?: boolean) {
		return await this.updateIterate<ISpaceView, ISpaceViewUpdateInput, SpaceView[]>(
			args,
			{
				child_ids: 'space_views',
				child_type: 'space_view',
				multiple,
				container: []
			},
			(id) => this.cache.space_view.get(id),
			(id, _, __, container) => container.push(new SpaceView({ ...this.getProps(), id }))
		);
	}
}

export default UserRoot;
