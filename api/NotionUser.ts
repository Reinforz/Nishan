import { v4 as uuidv4 } from 'uuid';

import Data from './Data';
import UserRoot from "./UserRoot"

import { INotionUserUpdateInput, INotionUser, ISpace, NishanArg, FilterTypes, FilterType, ISpaceUpdateInput, IOperation, UpdateCacheManuallyParam, TPage, ITPage, IUserRoot, IUserSettings, UpdateTypes, UpdateType } from '../types';
import { Operation } from '../utils';
import Space from './Space';
import UserSettings from './UserSettings';
import Page from './Page';
import CollectionViewPage from './CollectionViewPage';

/**
 * A class to represent NotionUser of Notion
 * @noInheritDoc
 */
class NotionUser extends Data<INotionUser> {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "notion_user" });
  }

  #getSpaceIds = () => {
    const space_ids: string[] = [];
    for (const [space_id] of this.cache.space)
      space_ids.push(space_id)
    return space_ids;
  }
  /**
   * Get the current logged in user settings
   * @returns Returns the logged in UserSettings object
   */
  getUserSettings() {
    const user_settings = this.cache.user_settings.get(this.user_id) as IUserSettings;
    this.logger && this.logger('READ', 'UserSettings', user_settings.id)
    return new UserSettings({
      ...this.getProps(),
      id: user_settings.id,
    });
  }

  getUserRoot() {
    const notion_user = this.cache.user_root.get(this.id) as IUserRoot;
    this.logger && this.logger('READ', 'UserRoot', notion_user.id)
    return new UserRoot({
      ...this.getProps(),
      id: this.id
    })
  }

  /**
   * Update the notion user
   * @param opt `UpdatableNotionUserParam`
   */

  async update(opt: INotionUserUpdateInput) {
    const [op, update] = this.updateCacheLocally(opt, ['family_name',
      'given_name',
      'profile_photo']);

    await this.saveTransactions([
      op
    ]);
    this.logger && this.logger(`UPDATE`, 'NotionUser', this.id);
    update();
  }

  /**
  * Create and return a new Space
  * @param opt Object for configuring the Space options
  * @returns Newly created Space object
  */
  async createWorkSpace(opt: ISpaceUpdateInput) {
    return (await this.createWorkSpaces([opt]))[0];
  };

  async createWorkSpaces(opts: ISpaceUpdateInput[], execute?: boolean) {
    const ops: IOperation[] = [], sync_records: UpdateCacheManuallyParam = [], space_ids: string[] = [];
    for (let index = 0; index < opts.length; index++) {
      const opt = opts[index], { name = "Workspace", icon = "", disable_public_access = false, disable_export = false, disable_move_to_space = false, disable_guests = false, beta_enabled = true, domain = "", invite_link_enabled = true } = opt, page_id = uuidv4(), $space_view_id = uuidv4(), { spaceId: space_id } = await this.createSpace({ name, icon });
      space_ids.push(space_id);
      ops.push(
        Operation.space.update(space_id, [], {
          disable_public_access,
          disable_export,
          disable_guests,
          disable_move_to_space,
          beta_enabled,
          invite_link_enabled,
          domain
        }),
        Operation.user_settings.update(this.user_id, ['settings'], {
          persona: 'personal', type: 'personal'
        }),
        Operation.space_view.set($space_view_id, [], {
          created_getting_started: false,
          created_onboarding_templates: false,
          space_id,
          notify_mobile: true,
          notify_desktop: true,
          notify_email: true,
          parent_id: this.user_id,
          parent_table: 'user_root',
          alive: true,
          joined: true,
          id: $space_view_id,
          version: 1,
          visited_templates: [],
          sidebar_hidden_templates: [],
        }),
        Operation.block.update(page_id, [], {
          type: 'page',
          id: page_id,
          version: 1,
          parent_id: space_id,
          parent_table: 'space',
          alive: true,
          permissions: [{ type: 'user_permission', role: 'editor', user_id: this.user_id }],
          properties: {
            title: [[name]]
          }
        }),
        Operation.user_root.listAfter(this.user_id, ['space_views'], { id: $space_view_id }),
        Operation.space.listAfter(space_id, ['pages'], { id: page_id }));
      sync_records.push([space_id, "space"], [$space_view_id, "space_view"], [this.user_id, "user_root"], page_id)
      this.logger && this.logger(`CREATE`, 'Space', space_id);
    };

    await this.executeUtil(ops, sync_records, execute);
    return space_ids.map(space_id => new Space({
      id: space_id,
      ...this.getProps()
    }))
  }

  /**
   * Get a space that is available on the user's account
   * @param arg A predicate filter function or a string
   * @returns The obtained Space object
   */
  async getSpace(arg?: FilterType<ISpace>) {
    return (await this.getSpaces(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  /**
   * Get multiple space objects on the user's account as an array
   * @param arg empty or A predicate function or a string array of ids
   * @returns An array of space objects
   */
  async getSpaces(args?: FilterTypes<ISpace>, multiple?: boolean) {
    return (await this.getIterate<ISpace>(args, {
      multiple,
      subject_type: "Space",
      child_ids: this.#getSpaceIds(),
    }, (space_id) => this.cache.space.get(space_id))).map((id) => new Space({
      ...this.getProps(),
      id
    }));
  }

  // FIX:1:H Fix the updateSpace method
  async updateSpace(arg: UpdateType<ISpace, ISpaceUpdateInput>, execute?: boolean) {
    return (await this.updateSpaces(typeof arg === "function" ? arg : [arg], execute, false))[0]
  }

  async updateSpaces(args: UpdateTypes<ISpace, ISpaceUpdateInput>, execute?: boolean, multiple?: boolean) {
    return (await this.updateIterate<ISpace, ISpaceUpdateInput>(args, {
      child_ids: this.#getSpaceIds(),
      subject_type: "Space",
      child_type: "space",
      multiple,
      execute
    }, (child_id) => this.cache.space.get(child_id))).map(id => new Space({ ...this.getProps(), id }))
  }

  async deleteSpace(arg: FilterType<ISpace>) {
    return (await this.deleteSpaces(typeof arg === "string" ? [arg] : arg, false));
  }

  async deleteSpaces(args: FilterTypes<ISpace>, multiple?: boolean) {
    const matches_ids = await this.getIterate<ISpace>(args, {
      child_ids: this.#getSpaceIds(),
      multiple,
      subject_type: "Space",
      method: "DELETE"
    }, (child_id) => this.cache.space.get(child_id));

    for (let index = 0; index < matches_ids.length; index++) {
      const spaceId = matches_ids[index];
      await this.enqueueTask({
        eventName: "deleteSpace",
        request: {
          spaceId
        }
      })
    }
  }

  // ? FEAT:1:M Add deleteSpaces methods

  async getTPagesById(ids: string[]) {
    const tpage_map: ITPage = { page: [], collection_view_page: [] }, tpage_content_ids: string[] = [];

    await this.updateCacheManually(ids);

    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      const page = this.cache.block.get(id) as TPage;
      if (page?.type === "page") {
        tpage_map.page.push(new Page({ ...this.getProps(), id: page.id }))
        if (page.content)
          tpage_content_ids.push(...page.content);
      } else if (page?.type === "collection_view_page")
        tpage_map.collection_view_page.push(new CollectionViewPage({ ...this.getProps(), id: page.id }));
    }

    if (tpage_content_ids.length)
      await this.updateCacheManually(tpage_content_ids);
    return tpage_map;
  }
}

export default NotionUser;
