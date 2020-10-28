import { v4 as uuidv4 } from 'uuid';

import { blockSet, collectionSet } from '../utils/chunk';

import Data from "./Data";

import { NishanArg } from "../types/types";
import { ICollection, IPageInput } from '../types/block';
import { CollectionUpdateParam } from '../types/function';
import { error } from '../utils/logs';

/**
 * A class to represent collection of Notion
 * @noInheritDoc
 */
class Collection extends Data<ICollection> {
  constructor(arg: NishanArg<ICollection>) {
    super(arg);
  }

  // ? FIX:1:M Save to cache and utilize Data update

  /**
   * Update the collection
   * @param properties `CollectionUpdateParam`
   */
  async update(properties: CollectionUpdateParam) {
    if (this.data) {
      await this.saveTransactions(
        [
          ...Object.entries(properties).map(([path, arg]) => collectionSet((this.data as any).id, [path], arg)),
          this.setOp(['last_edited_time'], Date.now())
        ]
      )
    } else
      throw new Error(error('Data has been deleted'))
  }

  // ? FEAT:1:E Return a page object
  /**
   * Create a template for the collection
   * @param opts Object for configuring template options
   */
  async createTemplate(opts: Omit<Partial<IPageInput>, "type">) {
    if (this.data) {
      const { properties = {}, format = {} } = opts;
      const $template_id = uuidv4();
      await this.saveTransactions([
        blockSet($template_id, [], {
          type: 'page',
          id: $template_id,
          version: 1,
          is_template: true,
          parent_id: this.data.id,
          parent_table: 'collection',
          alive: true,
          properties,
          format
        }),
        this.listAfterOp(['template_pages'], { id: $template_id })
      ]);
    } else
      throw new Error(error('Data has been deleted'))
  }
}

export default Collection;
