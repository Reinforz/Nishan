import { v4 as uuidv4 } from 'uuid';

import Data from './Data';

import { NishanArg, Predicate } from '../types/types';
import { INotionUser, ISpace } from '../types/api';
import { UpdatableNotionUserParam } from '../types/function';
import { userSettingsUpdate, spaceViewSet, blockUpdate, userRootListAfter, spaceListAfter } from '../utils/chunk';
import Space from './Space';

/**
 * A class to represent NotionUser of Notion
 * @noInheritDoc
 */
class NotionUser extends Data<INotionUser> {
  constructor(arg: NishanArg) {
    super(arg);
  }

  /**
   * Update the notion user
   * @param opt `UpdatableNotionUserParam`
   */

  async update(opt: UpdatableNotionUserParam) {
    const [op, update] = this.updateCacheLocally(opt, ['family_name',
      'given_name',
      'profile_photo']);

    await this.saveTransactions([
      op
    ]);
    update();
  }

  /**
   * Get a space that is available on the user's account
   * @param arg A predicate filter function or a string
   * @returns The obtained Space object
   */
  async getSpace(arg: Predicate<ISpace> | string) {
    return (await this.getSpaces(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  /**
   * Get multiple space objects on the user's account as an array
   * @param arg empty or A predicate function or a string array of ids
   * @returns An array of space objects
   */
  async getSpaces(arg: undefined | Predicate<ISpace> | string[], multiple: boolean = true) {
    const target_spaces: Space[] = [];
    let i = 0;

    for (const [, space] of this.cache.space) {
      let should_add = false;
      if (arg === undefined)
        should_add = true;
      else if (Array.isArray(arg) && arg.includes(space.id))
        should_add = true;
      else if (typeof arg === "function")
        should_add = await arg(space, i);

      if (should_add) {
        target_spaces.push(new Space({
          type: "space",
          id: space.id,
          interval: this.interval,
          token: this.token,
          cache: this.cache,
          user_id: space.permissions[0].user_id,
          shard_id: space.shard_id,
          space_id: space.id
        }))
      }

      if (!multiple && target_spaces.length === 1) break;
      i++;
    }
    return target_spaces;
  }

  /**
  * Create and return a new Space
  * @param opt Object for configuring the Space options
  * @returns Newly created Space object
  */
  async createWorkSpace(opt: Partial<Pick<ISpace, "name" | "icon">>) {
    const { name = "Workspace", icon = "" } = opt;

    const $block_id = uuidv4();
    const $space_view_id = uuidv4();

    const { spaceId: $space_id } = await this.createSpace({ name, icon });

    await this.saveTransactions([
      userSettingsUpdate(this.user_id, ['settings'], {
        persona: 'personal', type: 'personal'
      }),
      spaceViewSet($space_view_id, [], {
        created_getting_started: false,
        created_onboarding_templates: false,
        space_id: $space_id,
        notify_mobile: true,
        notify_desktop: true,
        notify_email: true,
        parent_id: this.user_id,
        parent_table: 'user_root',
        alive: true,
        joined: true,
        id: $space_view_id,
        version: 1,
        visited_templates: ["7e89f436-7aac-4f66-b0a6-6e65ec868d2a"],
        sidebar_hidden_templates: ["7e89f436-7aac-4f66-b0a6-6e65ec868d2a"],
      }),
      blockUpdate($block_id, [], {
        type: 'page',
        id: $block_id,
        version: 1,
        parent_id: $space_id,
        parent_table: 'space',
        alive: true,
        permissions: [{ type: 'user_permission', role: 'editor', user_id: this.user_id }],
        created_by_id: this.user_id,
        created_by_table: 'notion_user',
        created_time: Date.now(),
        last_edited_time: Date.now(),
        last_edited_by_table: 'notion_user',
        last_edited_by_id: this.user_id,
        properties: {
          title: [[name]]
        }
      }),
      userRootListAfter(this.user_id, ['space_views'], { id: $space_view_id }),
      spaceListAfter($space_id, ['pages'], { id: $block_id }),
    ]);
    await this.updateCacheManually([[$space_id, "space"], [$space_view_id, "space_view"], [this.user_id, "user_root"], $block_id]);
    const space = this.cache.space.get($space_id);
    if (space) {
      return new Space({
        type: "space",
        id: space.id,
        ...this.getProps()
      })
    };
  };
}

export default NotionUser;
