import { v4 as uuidv4 } from 'uuid';

import Data from './Data';
import UserRoot from "./UserRoot"

import { createPageMap, error, Operation } from '../utils';
import Space from './Space';
import UserSettings from './UserSettings';
import Page from './Page';
import CollectionViewPage from './CollectionViewPage';
import { INotionUser, IUserSettings, IUserRoot, ISpace, TPage, ISpaceView, ICollection } from '@nishans/types';
import { NishanArg, INotionUserUpdateInput, TNotionUserUpdateKeys, ISpaceUpdateInput, FilterType, FilterTypes, UpdateType, UpdateTypes } from '../types';
import { createSpace, enqueueTask, UpdateCacheManuallyParam } from '@nishans/endpoints';

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
    this.logger && this.logger('READ', 'user_settings', user_settings.id)
    return new UserSettings({
      ...this.getProps(),
      id: user_settings.id,
    });
  }

  getUserRoot() {
    const notion_user = this.cache.user_root.get(this.id) as IUserRoot;
    this.logger && this.logger('READ', 'user_root', notion_user.id)
    return new UserRoot({
      ...this.getProps(),
      id: this.id
    })
  }

  /**
   * Update the notion user
   * @param opt `UpdatableNotionUserParam`
   */

  update(opt: INotionUserUpdateInput) {
    this.updateCacheLocally(opt, TNotionUserUpdateKeys);
  }

  /**
  * Create and return a new Space
  * @param opt Object for configuring the Space options
  * @returns Newly created Space object
  */
  async createSpace(opt: ISpaceUpdateInput) {
    return (await this.createSpaces([opt]))[0];
  };

  // ? FEAT:1:H Take root pages to create as parameter 
  async createSpaces(opts: ISpaceUpdateInput[]) {
    const metadata = {
      created_by_id: this.user_id,
      created_by_table: "notion_user",
      created_time: Date.now(),
      last_edited_by_id: this.user_id,
      last_edited_by_table: "notion_user",
      last_edited_time: Date.now(),
    } as const;

    const spaces: Space[] = [];

    for (let index = 0; index < opts.length; index++) {
      const opt = opts[index], { name = "Workspace", icon = "", disable_public_access = false, disable_export = false, disable_move_to_space = false, disable_guests = false, beta_enabled = true, domain = "", invite_link_enabled = true } = opt, page_id = uuidv4(), $space_view_id = uuidv4(), { spaceId: space_id } = await createSpace({initialUseCases: [], planType: "personal", name, icon }, this.getConfigs());
      spaces.push(new Space({
        id: space_id,
        ...this.getProps()
      }))
      const space_op_data = {
        disable_public_access,
        disable_export,
        disable_guests,
        disable_move_to_space,
        beta_enabled,
        invite_link_enabled,
        domain,
      }, space_extra_data = {
        ...metadata,
        id: space_id,
        invite_link_code: "",
        name,
        pages: [],
        permissions: [],
        plan_type: "personal",
        shard_id: this.shard_id,
        version: 0,
        icon,
      } as any;

      this.cache.space.set(space_id, JSON.parse(JSON.stringify({...space_op_data, ...space_extra_data})));
      const space_view_data: ISpaceView = {
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
        bookmarked_pages: []
      }
      this.cache.space_view.set($space_view_id, space_view_data);
      const user_root = this.cache.user_root.get(this.user_id);
      user_root?.space_views.push($space_view_id);
      this.stack.push(
        Operation.space.update(space_id, [], space_op_data),
        Operation.user_settings.update(this.user_id, ['settings'], {
          persona: 'personal', type: 'personal'
        }),
        Operation.space_view.set($space_view_id, [], JSON.parse(JSON.stringify(space_view_data))),
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
        Operation.space.listAfter(space_id, ['pages'], { id: page_id })
      );
      this.logger && this.logger(`CREATE`, 'space', space_id);
    };

    return spaces;
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
    return await this.getIterate<ISpace, Space[]>(args, {
      multiple,
      container: [],
      child_type: "space",
      child_ids: this.#getSpaceIds(),
    }, (space_id,) => this.cache.space.get(space_id), (id, {shard_id}, spaces)=>{
      spaces.push(new Space({
        ...this.getProps(),
        space_id: id,
        shard_id,
        id
      }))
    });
  }

  // FIX:1:H Fix the updateSpace method
  async updateSpace(arg: UpdateType<ISpace, ISpaceUpdateInput>) {
    return (await this.updateSpaces(typeof arg === "function" ? arg : [arg],  false))[0]
  }

  async updateSpaces(args: UpdateTypes<ISpace, ISpaceUpdateInput>, multiple?: boolean) {
    return await this.updateIterate<ISpace, ISpaceUpdateInput, Space[]>(args, {
      child_ids: this.#getSpaceIds(),
      child_type: "space",
      multiple,
      container: []
    }, (child_id) => this.cache.space.get(child_id), (id, _,__,spaces)=>spaces.push(new Space({ ...this.getProps(), id })))
  }

  async deleteSpace(arg: FilterType<ISpace>) {
    return (await this.deleteSpaces(typeof arg === "string" ? [arg] : arg, false));
  }

  async deleteSpaces(args: FilterTypes<ISpace>, multiple?: boolean) {
    await this.deleteIterate<ISpace>(args, {
      child_ids: this.#getSpaceIds(),
      multiple,
      child_type: "space",
      manual: true,
      container: []
    }, (space_id) => this.cache.space.get(space_id), async (spaceId)=>{
      await enqueueTask({
        task: {
          eventName: "deleteSpace",
          request: {
            spaceId
          }
        }
      }, this.getConfigs())
    });
  }

  async getTPagesById(ids: string[]) {
    const tpage_map = createPageMap(), sync_records: UpdateCacheManuallyParam = [];
    await this.updateCacheManually(ids);
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      const page = this.cache.block.get(id) as TPage;
      if (page?.type === "page") {
        const page_obj = new Page({ ...this.getProps(), id: page.id })
        tpage_map.page.set(page.id, page_obj)
        tpage_map.page.set(page.properties.title[0][0], page_obj)
        if (page.content)
          page.content.forEach(content_id=>sync_records.push(content_id))
      } else if (page?.type === "collection_view_page"){
        const cvp_obj = new CollectionViewPage({ ...this.getProps(), id: page.id });
        await this.initializeCacheForSpecificData(page.id, "block");
        const collection = this.cache.collection.get(page.collection_id) as ICollection;
        tpage_map.collection_view_page.set(collection.name[0][0], cvp_obj);
        tpage_map.collection_view_page.set(page.id, cvp_obj);
      }else
        error(`The data is neither a page nor a cvp`)
    }

    if (sync_records.length)
      await this.updateCacheManually(sync_records);
    return tpage_map;
  }
}

export default NotionUser;
