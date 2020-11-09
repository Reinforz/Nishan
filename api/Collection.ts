import { v4 as uuidv4 } from 'uuid';

import { Operation } from '../utils';

import Data from "./Data";

import { ICollection, IPageInput, UpdatableCollectionUpdateParam, NishanArg, IOperation } from "../types";

/**
 * A class to represent collection of Notion
 * @noInheritDoc
 */
class Collection extends Data<ICollection> {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "collection" });
  }

  // ? FIX:1:M Save to cache and utilize Data update

  /**
   * Update the collection
   * @param opt `CollectionUpdateParam`
   */
  async update(opt: UpdatableCollectionUpdateParam) {
    const [op, update] = this.updateCacheLocally(opt, ["description", "name", "icon"])
    await this.saveTransactions([
      op
    ]);
    update();
  }

  // ? FEAT:1:E Return a page object
  /**
   * Create a template for the collection
   * @param opts Object for configuring template options
   */
  async createTemplate(opts: Omit<Partial<IPageInput>, "type">) {
    const data = this.getCachedData();
    const { properties = {}, format = {} } = opts;
    const $template_id = uuidv4();
    await this.saveTransactions([
      Operation.block.set($template_id, [], {
        type: 'page',
        id: $template_id,
        version: 1,
        is_template: true,
        parent_id: data.id,
        parent_table: 'collection',
        alive: true,
        properties,
        format
      }),
      this.listAfterOp(['template_pages'], { id: $template_id })
    ]);

  }

  // ? TD:2:H Better TS Support rather than using any
  /**
   * Add rows of data to the collection block
   * @param rows
   * @returns An array of newly created page objects
   */
  async addRows(rows: { format: any, properties: any }[]) {
    const Page = require('./Page');
    const page_ids: string[] = [];
    const ops: IOperation[] = [];
    rows.map(({ format, properties }) => {
      const data = this.getCachedData();
      const $page_id = uuidv4();
      page_ids.push($page_id);
      ops.push(
        Operation.block.update($page_id, [], {
          alive: true,
          $block_id: $page_id,
          type: "page",
          properties,
          format,
          parent_id: data.id,
          parent_table: 'collection',
        }),
        this.setOp(['last_edited_time'], Date.now())
      );
    });
    await this.saveTransactions(ops)

    return page_ids.map((page_id) => new Page({
      type: "block",
      id: page_id,
      ...this.getProps()
    }))
  }
}

export default Collection;
