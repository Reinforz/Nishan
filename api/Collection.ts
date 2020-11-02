import { v4 as uuidv4 } from 'uuid';

import { blockSet, blockUpdate, collectionSet } from '../utils/chunk';

import Data from "./Data";

import { NishanArg, Operation } from "../types/types";
import { ICollection, IPageInput } from '../types/block';
import { CollectionUpdateParam } from '../types/function';

/**
 * A class to represent collection of Notion
 * @noInheritDoc
 */
class Collection extends Data<ICollection> {
  constructor(arg: NishanArg) {
    super(arg);
  }

  // ? FIX:1:M Save to cache and utilize Data update

  /**
   * Update the collection
   * @param properties `CollectionUpdateParam`
   */
  async update(properties: CollectionUpdateParam) {
    const data = this.getCachedData();
    await this.saveTransactions(
      [
        ...Object.entries(properties).map(([path, arg]) => collectionSet((data as any).id, [path], arg)),
        this.setOp(['last_edited_time'], Date.now())
      ]
    )
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
      blockSet($template_id, [], {
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
    const ops: Operation[] = [];
    const current_time = Date.now();
    rows.map(({ format, properties }) => {
      const data = this.getCachedData();
      const $page_id = uuidv4();
      page_ids.push($page_id);
      ops.push(
        blockUpdate($page_id, [], {
          alive: true,
          created_time: current_time,
          created_by_id: this.user_id,
          created_by_table: 'notion_user',
          last_edited_time: current_time,
          last_edited_by_id: this.user_id,
          last_edited_by_table: 'notion_user',
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
