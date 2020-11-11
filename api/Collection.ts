import { v4 as uuidv4 } from 'uuid';

import { Operation } from '../utils';

import Data from "./Data";

import { ICollection, IPageInput, UpdatableCollectionUpdateParam, NishanArg, IOperation, BlockRepostionArg } from "../types";
import Page from './Page';

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
  async createTemplate(opt: Omit<Partial<IPageInput>, "type">) {
    return (await this.createTemplates([opt]))[0]
  }

  async createTemplates(opts: (Omit<Partial<IPageInput>, "type"> & { position?: number | BlockRepostionArg })[]) {
    const ops: IOperation[] = [], template_ids: string[] = [];
    for (let index = 0; index < ops.length; index++) {
      const opt = opts[index],
        { properties = {}, format = {} } = opt,
        $template_id = uuidv4();
      const block_list_op = this.addToChildArray($template_id, opt.position);
      template_ids.push($template_id);
      ops.push(Operation.block.set($template_id, [], {
        type: 'page',
        id: $template_id,
        version: 1,
        is_template: true,
        parent_id: this.id,
        parent_table: 'collection',
        alive: true,
        properties,
        format
      }), block_list_op);
    }

    await this.saveTransactions(ops);
    await this.updateCacheManually(template_ids);
    return template_ids.map(template_id => new Page({
      ...this.getProps(),
      id: template_id,
    }))
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
