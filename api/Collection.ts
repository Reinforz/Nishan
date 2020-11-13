import { v4 as uuidv4 } from 'uuid';

import { error, Operation } from '../utils';

import Data from "./Data";

import { ICollection, IPageInput, UpdatableCollectionUpdateParam, NishanArg, IOperation, BlockRepostionArg, IPage, Predicate, /* IPage, Predicate */ } from "../types";
import Page from './Page';
import GetItems from '../mixins/GetItems';

/**
 * A class to represent collection of Notion
 * @noInheritDoc
 */
class Collection extends GetItems<ICollection>(Data) {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "collection" });
  }

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

  /**
   * Create a template for the collection
   * @param opts Object for configuring template options
   */
  async createTemplate(opt: Omit<Partial<IPageInput>, "type">) {
    return (await this.createTemplates([opt]))[0]
  }

  /**
   * Get multiple template pages of the collection
   * @param arg string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   * @returns An array of template pages object
   */
  async getTemplates(arg: undefined | string[] | Predicate<IPage>, multiple: boolean = true): Promise<Page[]> {
    const _this = this;
    return this.getItems<IPage>(arg as any, multiple, async function (page) {
      return new Page({
        ..._this.getProps(),
        id: page.id
      }) as any
    })
  }

  /**
   * Get a single template page of the collection
   * @param arg string id or a predicate function
   * @returns Template page object
   */
  async getTemplate(arg: string | Predicate<IPage>) {
    return (await this.getTemplates(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  /**
   * Create multiple templates for the collection
   * @param opts Array of Objects for configuring template options
   */
  async createTemplates(opts: (Omit<Partial<IPageInput>, "type"> & { position?: number | BlockRepostionArg })[]) {
    const ops: IOperation[] = [], template_ids: string[] = [];

    for (let index = 0; index < opts.length; index++) {
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

  async updateTemplates(arg: [string, Omit<IPageInput, "type">][]) {
    const data = this.getCachedData(), ops: IOperation[] = [], current_time = Date.now(), block_ids: string[] = [];
    for (let index = 0; index < arg.length; index++) {
      const [id, opts] = arg[index];
      block_ids.push(id);
      if (data.template_pages && data.template_pages.includes(id))
        ops.push(Operation.block.update(id, [], { ...opts, last_edited_time: current_time }))
      else
        throw new Error(error(`Collection:${data.id} is not the parent of Template Page:${id}`));
    }
    await this.saveTransactions(ops);
    await this.updateCacheManually(block_ids);
  }

  async updateTemplate(id: string, opt: Omit<IPageInput, "type">) {
    await this.updateTemplates([[id, opt]]);
  }

  /**
   * Delete a single template page from the collection
   * @param arg string id or a predicate function
   */
  async deleteTemplate(arg: string | Predicate<IPage>) {
    return await this.deleteTemplates(typeof arg === "string" ? [arg] : arg, false);
  }

  /**
   * Delete multiple template pages from the collection
   * @param arg string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
  async deleteTemplates(arg: undefined | string[] | Predicate<IPage>, multiple: boolean = true) {
    await this.deleteItems<IPage>(arg, multiple)
  }

  // ? TD:2:H Better TS Support rather than using any
  /**
   * Add rows of data to the collection block
   * @param rows
   * @returns An array of newly created page objects
   */
  async addRows(rows: { format: any, properties: any }[]) {
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
        })
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
