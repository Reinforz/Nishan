import { v4 as uuidv4 } from 'uuid';

import Getters from "./Getters";
import Page from "./Page";

import { spaceListBefore, blockUpdate } from '../utils/chunk';
import { error } from "../utils/logs";

import { NishanArg, ISpace, PageFormat, PageProps, IRootPage } from "../types";

// ? FEAT:2 Add space related methods
class Space extends Getters {
  space_data: ISpace;

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

}

export default Space;
