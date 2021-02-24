import { Mutations } from '@nishans/endpoints';
import { UnsupportedBlockTypeError } from '@nishans/errors';
import { generateId, idToUuid, uuidToId } from '@nishans/idz';
import { Operation } from '@nishans/operations';
import { ICollection, INotionUser, ISpace, ISpaceView, IUserRoot, IUserSettings, TPage } from '@nishans/types';
import { CreateData, CreateMaps, transformToMultiple } from '../libs';
import { CollectionViewPage, Page } from '../src';
import { FilterType, FilterTypes, INotionUserUpdateInput, ISpaceCreateInput, ISpaceUpdateInput, NishanArg, TNotionUserUpdateKeys, UpdateType, UpdateTypes } from '../types';
import Data from './Data';
import Space from './Space';
import UserRoot from "./UserRoot";
import UserSettings from './UserSettings';

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
  async createSpace(opt: ISpaceCreateInput) {
    return (await this.createSpaces([opt]))[0];
  };

  // ? FEAT:1:H Take root pages to create as parameter 
  async createSpaces(opts: ISpaceCreateInput[]) {
    const metadata = {
      created_by_id: this.user_id,
      created_by_table: "notion_user",
      created_time: Date.now(),
      last_edited_by_id: this.user_id,
      last_edited_by_table: "notion_user",
      last_edited_time: Date.now(),
      version: 0,
    } as const;

    const spaces: Space[] = [];

    for (let index = 0; index < opts.length; index++) {
      const opt = opts[index], { name, icon = "", disable_public_access = false, disable_export = false, disable_move_to_space = false, disable_guests = false, beta_enabled = true, invite_link_enabled = true } = opt, space_view_id = generateId(), { spaceId: space_id } = await Mutations.createSpace({initialUseCases: [], planType: "personal", name, icon }, this.getConfigs());

      spaces.push(new Space({
        id: space_id,
        ...this.getProps()
      }));

      const space_op_data = {
        disable_public_access,
        disable_export,
        disable_guests,
        disable_move_to_space,
        beta_enabled,
        invite_link_enabled,
      }, space_extra_data = {
        ...metadata,
        id: space_id,
        invite_link_code: "",
        name,
        pages: [],
        permissions: [],
        plan_type: "personal",
        shard_id: this.Operations.shard_id,
        icon,
      } as any;
      
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
        id: space_view_id,
        version: 1,
        visited_templates: [],
        sidebar_hidden_templates: [],
        bookmarked_pages: []
      };

      const cached_space_data = JSON.parse(JSON.stringify({...space_op_data, ...space_extra_data}))

      this.cache.space.set(space_id, cached_space_data);
      this.cache.space_view.set(space_view_id, space_view_data);

      const user_root = this.cache.user_root.get(this.user_id) as IUserRoot;
      user_root.space_views.push(space_view_id);

      this.Operations.pushToStack(
        [
          Operation.space.update(space_id, [], space_op_data),
          Operation.space_view.update(space_view_id, [], JSON.parse(JSON.stringify(space_view_data))),
          Operation.user_root.listAfter(this.user_id, ['space_views'], { after: '', id: space_view_id })
        ],
      );

      this.logger && this.logger(`CREATE`, 'space', space_id);
      this.logger && this.logger(`CREATE`, 'space_view', space_view_id);
      this.logger && this.logger(`UPDATE`, 'user_root', this.user_id);
      this.logger && this.logger(`UPDATE`, 'space', space_id);

      await CreateData.contents(opt.contents, space_id, "space", {...this.getProps(), space_id})
    };

    return spaces;
  }

  /**
   * Get a space that is available on the user's account
   * @param arg A predicate filter function or a string
   * @returns The obtained Space object
   */
  async getSpace(arg?: FilterType<ISpace>) {
    return (await this.getSpaces(transformToMultiple(arg), false))[0]
  }

  /**
   * Get multiple space objects on the user's account as an array
   * @param arg empty or A predicate function or a string array of ids
   * @returns An array of space objects
   */
  async getSpaces(args?: FilterTypes<ISpace>, multiple?: boolean) {
    console.log(this.Operations.getPlugins());
    
    return await this.getIterate<ISpace, Space[]>(args, {
      multiple,
      container: [],
      child_type: "space",
      child_ids: this.#getSpaceIds(),
    }, (space_id) => this.cache.space.get(space_id), (id, {shard_id}, spaces)=>{
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
    return (await this.updateSpaces(transformToMultiple(arg), false))[0];
  }

  async updateSpaces(args: UpdateTypes<ISpace, ISpaceUpdateInput>, multiple?: boolean) {
    return await this.updateIterate<ISpace, ISpaceUpdateInput, Space[]>(args, {
      child_ids: this.#getSpaceIds(),
      child_type: "space",
      multiple,
      container: []
    }, (child_id) => this.cache.space.get(child_id), (id, _,__,spaces)=>spaces.push(new Space({ ...this.getProps(), id })))
  }

  // FIX:1:H How will deleting a space manipulate the internal cache 
  async deleteSpace(arg: FilterType<ISpace>) {
    (await this.deleteSpaces(transformToMultiple(arg), false));
  }

  async deleteSpaces(args: FilterTypes<ISpace>, multiple?: boolean) {
    await this.deleteIterate<ISpace>(args, {
      child_ids: this.#getSpaceIds(),
      multiple,
      child_type: "space",
      manual: true,
      container: []
    }, (space_id) => this.cache.space.get(space_id), async (spaceId)=>{
      await Mutations.enqueueTask({
        task: {
          eventName: "deleteSpace",
          request: {
            spaceId
          }
        }
      }, this.getConfigs())
    });
  }

  async getPagesById(ids: string[]) {
    const page_map = CreateMaps.page();
    await this.updateCacheIfNotPresent(ids.map(id=>[id, 'block']));
    for (let index = 0; index < ids.length; index++) {
      const id = idToUuid(uuidToId(ids[index])), page = this.cache.block.get(id) as TPage;
      if (page.type === "page") {
        const page_obj = new Page({ ...this.getProps(), id: page.id })
        page_map.page.set(page.id, page_obj)
        page_map.page.set(page.properties.title[0][0], page_obj);
        await this.initializeCacheForSpecificData(page.id, "block");
      } else if (page.type === "collection_view_page"){
        const cvp_obj = new CollectionViewPage({ ...this.getProps(), id: page.id });
        const collection = this.cache.collection.get(page.collection_id) as ICollection;
        page_map.collection_view_page.set(collection.name[0][0], cvp_obj);
        page_map.collection_view_page.set(page.id, cvp_obj);
        await this.initializeCacheForSpecificData(page.id, "block");
      }
      else
        throw new UnsupportedBlockTypeError((page as any).type,['page', 'collection_view_page'])
    }
    return page_map;
  }
}

export default NotionUser;
