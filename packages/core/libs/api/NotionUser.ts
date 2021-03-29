import { NotionEndpoints } from '@nishans/endpoints';
import { NotionFabricator } from '@nishans/fabricator';
import { NotionIdz } from '@nishans/idz';
import { NotionInit } from '@nishans/init';
import { NotionLineage } from '@nishans/lineage';
import { NotionLogger } from '@nishans/logger';
import { NotionOperations } from '@nishans/operations';
import { FilterType, FilterTypes, UpdateType, UpdateTypes } from '@nishans/traverser';
import { INotionUser, ISpace, IUserRoot, IUserSettings } from '@nishans/types';
import {
	INotionCoreOptions,
	INotionUserUpdateInput,
	ISpaceCreateInput,
	ISpaceUpdateInput,
	TNotionUserUpdateKeys
} from '../';
import { transformToMultiple } from '../utils';
import Data from './Data';
import Space from './Space';
import UserRoot from './UserRoot';
import UserSettings from './UserSettings';

/**
 * A class to represent NotionUser of Notion
 * @noInheritDoc
 */
class NotionUser extends Data<INotionUser> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg, type: 'notion_user' });
	}

	/**
   * Get the current logged in user settings
   * @returns Returns the logged in UserSettings object
   */
	getUserSettings () {
		const user_settings = this.cache.user_settings.get(this.user_id) as IUserSettings;
		this.logger && NotionLogger.method.info(`READ user_settings ${user_settings.id}`);
		return new UserSettings({
			...this.getProps(),
			id: user_settings.id
		});
	}

	getUserRoot () {
		const notion_user = this.cache.user_root.get(this.id) as IUserRoot;
		this.logger && NotionLogger.method.info(`READ user_root ${notion_user.id}`);
		return new UserRoot({
			...this.getProps(),
			id: this.id
		});
	}

	/**
   * Update the notion user
   * @param opt `UpdatableNotionUserParam`
   */

	async update (opt: INotionUserUpdateInput) {
		await this.updateCacheLocally(opt, TNotionUserUpdateKeys);
	}

	/**
  * Create and return a new Space
  * @param opt Object for configuring the Space options
  * @returns Newly created Space object
  */
	async createSpace (opt: ISpaceCreateInput) {
		return (await this.createSpaces([ opt ]))[0];
	}

	async createSpaces (opts: ISpaceCreateInput[]) {
		const spaces: Space[] = [];

		for (let index = 0; index < opts.length; index++) {
			const opt = opts[index],
				{
					name,
					icon = '',
					disable_public_access = false,
					disable_export = false,
					disable_move_to_space = false,
					disable_guests = false,
					beta_enabled = true,
					invite_link_enabled = true
				} = opt,
				space_view_id = NotionIdz.Generate.id(),
				{ spaceId: space_id, recordMap: { space } } = await NotionEndpoints.Mutations.createSpace(
					{ initialUseCases: [], planType: 'personal', name, icon },
					this.getProps()
				);
			spaces.push(
				new Space({
					id: space_id,
					...this.getProps(),
					space_id,
					shard_id: space[space_id].value.shard_id
				})
			);
			const space_op_data = {
				disable_public_access,
				disable_export,
				disable_guests,
				disable_move_to_space,
				beta_enabled,
				invite_link_enabled
			};

			const space_view_data = NotionInit.spaceView({
				id: space_view_id,
				parent_id: this.user_id,
				space_id
			});

			this.cache.space.set(space_id, JSON.parse(JSON.stringify(space[space_id].value)));
			this.cache.space_view.set(space_view_id, space_view_data);

			const user_root = this.cache.user_root.get(this.user_id) as IUserRoot;
			user_root.space_views.push(space_view_id);

			await NotionOperations.executeOperations(
				[
					NotionOperations.Chunk.space.update(space_id, [], space_op_data),
					NotionOperations.Chunk.space_view.update(space_view_id, [], JSON.parse(JSON.stringify(space_view_data))),
					NotionOperations.Chunk.user_root.listAfter(this.user_id, [ 'space_views' ], { after: '', id: space_view_id })
				],
				this.getProps()
			);

			this.logger && NotionLogger.method.info(`CREATE space ${space_id}`);
			this.logger && NotionLogger.method.info(`CREATE space_view ${space_view_id}`);
			this.logger && NotionLogger.method.info(`UPDATE user_root ${this.user_id}`);
			this.logger && NotionLogger.method.info(`UPDATE space ${space_id}`);

			await NotionFabricator.CreateData.contents(opt.contents, space_id, 'space', { ...this.getProps(), space_id });
		}

		return spaces;
	}

	/**
   * Get a space that is available on the user's account
   * @param arg A predicate filter function or a string
   * @returns The obtained Space object
   */
	async getSpace (arg?: FilterType<ISpace>) {
		return (await this.getSpaces(transformToMultiple(arg), false))[0];
	}

	/**
   * Get multiple space objects on the user's account as an array
   * @param arg empty or A predicate function or a string array of ids
   * @returns An array of space objects
   */
	async getSpaces (args?: FilterTypes<ISpace>, multiple?: boolean) {
		return await this.getIterate<ISpace, Space[]>(
			args,
			{
				multiple,
				container: [],
				child_type: 'space',
				child_ids: NotionLineage.NotionUser.getSpaceIds(this.cache)
			},
			(space_id) => this.cache.space.get(space_id),
			(id, { shard_id }, spaces) => {
				spaces.push(
					new Space({
						...this.getProps(),
						space_id: id,
						shard_id,
						id
					})
				);
			}
		);
	}

	// FIX:1:H Fix the updateSpace method
	async updateSpace (arg: UpdateType<ISpace, ISpaceUpdateInput>) {
		return (await this.updateSpaces(transformToMultiple(arg), false))[0];
	}

	async updateSpaces (args: UpdateTypes<ISpace, ISpaceUpdateInput>, multiple?: boolean) {
		return await this.updateIterate<ISpace, ISpaceUpdateInput, Space[]>(
			args,
			{
				child_ids: NotionLineage.NotionUser.getSpaceIds(this.cache),
				child_type: 'space',
				multiple,
				container: []
			},
			(child_id) => this.cache.space.get(child_id),
			(id, { shard_id }, __, spaces) => spaces.push(new Space({ ...this.getProps(), id, shard_id, space_id: id }))
		);
	}

	// FIX:1:H How will deleting a space manipulate the internal cache
	async deleteSpace (arg: FilterType<ISpace>) {
		return await this.deleteSpaces(transformToMultiple(arg), false);
	}

	async deleteSpaces (args: FilterTypes<ISpace>, multiple?: boolean) {
		return await this.deleteIterate<ISpace, Space[]>(
			args,
			{
				child_ids: NotionLineage.NotionUser.getSpaceIds(this.cache),
				multiple,
				child_type: 'space',
				manual: true,
				container: []
			},
			(space_id) => this.cache.space.get(space_id),
			async (spaceId, _, container) => {
				await NotionEndpoints.Mutations.enqueueTask(
					{
						task: {
							eventName: 'deleteSpace',
							request: {
								spaceId
							}
						}
					},
					this.getProps()
				);
				container.push(new Space({ id: spaceId, ...this.getProps() }));
			}
		);
	}
}

export default NotionUser;
