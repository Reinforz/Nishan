import { v4 as uuidv4 } from 'uuid';

import Getters from "./Getters";
import Page from "./Page";
import SpaceView from "./SpaceView";

import { spaceListBefore, blockUpdate, spaceUpdate } from '../utils/chunk';
import { error } from "../utils/logs";

import { NishanArg, ISpace, PageFormat, PageProps, IRootPage, ISpaceView } from "../types";

// ? FEAT:2 Add space related methods
class Space extends Getters {
  space_data: undefined | ISpace;

  constructor(arg: NishanArg & { space_data: ISpace }) {
    super(arg)
    this.space_data = arg.space_data;
  }

  /**
   * Create a new page using passed properties and formats
   * @param opts format and properties of the new page
   */
  async createRootPage(opts = {} as { properties: PageProps, format: PageFormat, isPrivate: boolean }) {
    const { properties = {}, format = {}, isPrivate = false } = opts;
    const $block_id = uuidv4();
    if (this.space_id && this.user_id) {
      await this.saveTransactions(
        [
          blockUpdate($block_id, [], {
            type: 'page', id: $block_id, version: 1, permissions: [{ type: isPrivate ? "user_permission" : 'space_permission', role: 'editor', user_id: this.user_id }], parent_id: this.space_id,
            parent_table: 'space',
            alive: true,
            properties,
            format,
            last_edited_time: Date.now(),
            last_edited_by_id: this.user_id,
            last_edited_by_table: 'notion_user',
            created_by_id: this.user_id,
            created_by_table: 'notion_user',
            created_time: Date.now(),
          }),
          spaceListBefore(this.space_id, ['pages'], { id: $block_id }),
        ]
      );

      const recordMap = await this.getBacklinksForBlock($block_id);

      return new Page({
        ...this.getProps(),
        block_data: recordMap.block[$block_id].value as IRootPage
      });
    } else
      throw new Error(error("Space and User id not provided"))
  }

  /**
   * Update the workspace settings
   * @param opt Properties of the space to update
   */
  async update(opt: Partial<Pick<ISpace, "name" | "beta_enabled" | "icon">>) {
    if (this.space_data) {
      const { name = this.space_data.name, beta_enabled = this.space_data.beta_enabled, icon = this.space_data.icon } = opt;
      const current_time = Date.now();
      await this.saveTransactions([
        spaceUpdate(this.space_data.id, [], {
          name,
          beta_enabled,
          icon,
          last_edited_time: current_time
        })
      ]);
      // ? RF:1:M Use a utility method to update the cache and internal class state
      const cached_data = this.cache.space.get(this.space_data.id);
      if (cached_data) {
        cached_data.icon = icon;
        cached_data.beta_enabled = beta_enabled;
        cached_data.last_edited_time = current_time;
        cached_data.name = name;
        this.cache.space.set(this.space_data.id, cached_data)
      }
      this.space_data.icon = icon;
      this.space_data.beta_enabled = beta_enabled;
      this.space_data.last_edited_time = current_time;
      this.space_data.name = name;
    } else
      throw new Error(error("This space has been deleted"))
  }

  /**
   * Delete the current workspace
   */
  async delete() {
    if (this.space_data) {
      await this.enqueueTask({
        eventName: "deleteSpace",
        request: {
          spaceId: this.space_data.id
        }
      })
      this.cache.space.delete(this.space_data.id);
    } else
      throw new Error(error("This space has been deleted"))

    this.space_data = undefined;
  }

  async getSpaceView() {
    let target_space_view: ISpaceView | null = null;
    for (let [, space_view] of this.cache.space_view) {
      if (this.space_data && space_view.space_id === this.space_data.id) {
        target_space_view = space_view;
        break;
      }
    }
    if (target_space_view) return new SpaceView({
      space_view_data: target_space_view,
      ...this.getProps()
    })
  }
}

export default Space;
