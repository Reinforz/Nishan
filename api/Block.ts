import { v4 as uuidv4 } from 'uuid';

import { blockListRemove, blockSet, blockListAfter, spaceSet, spaceListRemove, blockUpdate } from '../utils/chunk';

import Data from "./Data";

import { TBasicBlockType, NishanArg, TBlockType } from "../types/types"
import { BlockRepostionArg, CreateBlockArg } from "../types/function";
import { IAudio, IAudioInput, IBreadcrumb, IBreadcrumbInput, IBulletedList, IBulletedListInput, ICallout, ICalloutInput, ICode, ICodeInput, ICodepen, ICodepenInput, IDivider, IDividerInput, IDrive, IDriveInput, IEquation, IEquationInput, IFactory, IFactoryInput, IFigma, IFigmaInput, IFile, IFileInput, IGist, IGistInput, IHeader, IHeaderInput, IImage, IImageInput, IMaps, IMapsInput, INumberedList, INumberedListInput, IQuote, IQuoteInput, ISubHeader, ISubHeaderInput, IText, ITextInput, ITOC, ITOCInput, ITodo, ITodoInput, IToggle, IToggleInput, ITweet, ITweetInput, IVideo, IVideoInput, IWebBookmark, IWebBookmarkInput, TBlock, TBlockInput } from '../types/block';

/**
 * A class to represent block of Notion
 * @noInheritDoc
 */
class Block<T extends TBlock, A extends TBlockInput> extends Data<T> {
  constructor(arg: NishanArg) {
    super(arg);
  }

  /**
   * Reposition a block to a new position
   * @param arg number of new index or `BlockRepostionArg`
   */
  async reposition(arg: number | BlockRepostionArg) {
    const data = this.getCachedData(this.id);
    const [block_content_op, update] = this.addToChildArray(this.id, arg, [data.parent_id, data.parent_table as any]);
    await this.saveTransactions([block_content_op]);
    update();
    await this.updateCacheManually([[data.parent_id, data.parent_table as any]]);
  }

  // ? FEAT:1:M Take a position arg
  /**
   * Duplicate the current block
   * @returns The duplicated block object
   */
  async duplicate() {
    const data = this.getCachedData();
    const $gen_block_id = uuidv4();
    await this.saveTransactions(
      [
        blockUpdate($gen_block_id, [], {
          id: $gen_block_id,
          type: "copy_indicator",
          parent_id: data.parent_id,
          parent_table: "block",
          alive: true,
        }),
        blockListAfter(data.parent_id, ['content'], {
          after: data.id,
          id: $gen_block_id
        }),
      ]
    );

    await this.enqueueTask({
      eventName: 'duplicateBlock',
      request: {
        sourceBlockId: data.id,
        targetBlockId: $gen_block_id,
        addCopyName: true
      }
    });

    await this.updateCacheManually([$gen_block_id, data.parent_id])

    return this.createClass(data.type, $gen_block_id);
  }

  /**
   * Update a block's properties and format
   * @param args Block update format and properties options
   */
  async update(args: Partial<A>) {
    const data = this.getCachedData();

    const { format = data.format, properties = data.properties } = args;
    await this.saveTransactions(
      [
        this.updateOp([], {
          properties,
          format,
          last_edited_time: Date.now()
        }),
      ]
    )
    await this.updateCacheManually([data.id]);
  }

  /**
   * Convert the current block to a different basic block
   * @param type `TBasicBlockType` basic block types
   */
  async convertTo(type: TBasicBlockType) {
    const data = this.getCachedData();
    await this.saveTransactions([
      this.updateOp([], { type })
    ]);

    const cached_value = this.cache.block.get(data.id);
    if (cached_value) {
      data.type = type;
      cached_value.type = type;
      this.cache.block.set(data.id, cached_value);
    }
    await this.updateCacheManually([data.id]);
  }

  /**
   * Delete the current block
   */
  async delete() {
    const data = this.getCachedData();
    const current_time = Date.now();
    const is_root_page = data.parent_table === "space" && data.type === "page";
    await this.saveTransactions(
      [
        this.updateOp([], {
          alive: false,
          last_edited_time: current_time
        }),
        is_root_page ? spaceListRemove(data.space_id, ['pages'], { id: data.id }) : blockListRemove(data.parent_id, ['content'], { id: data.id }),
        is_root_page ? spaceSet(data.space_id, ['last_edited_time'], current_time) : blockSet(data.parent_id, ['last_edited_time'], current_time)
      ]
    );
    this.cache.block.delete(this.id);
  }

  /**
   * Transfer a block from one parent page to another page
   * @param new_parent_id Id of the new parent page
   */
  async transfer(new_parent_id: string) {
    const data = this.getCachedData();
    const current_time = Date.now();
    await this.saveTransactions(
      [
        this.updateOp([], { last_edited_time: current_time, permissions: null, parent_id: new_parent_id, parent_table: 'block', alive: true }),
        blockListRemove(data.parent_id, ['content'], { id: data.id }),
        blockListAfter(new_parent_id, ['content'], { after: '', id: data.id }),
        blockSet(data.parent_id, ['last_edited_time'], current_time),
        blockSet(new_parent_id, ['last_edited_time'], current_time)
      ]
    )
    await this.updateCacheManually([this.id, data.parent_id, new_parent_id]);
  }

  // ? TD:1:H Add type definition propertoes and format for specific block types
  createBlock({ $block_id, type, properties = {}, format = {}, parent_id, parent_table = 'block' }: CreateBlockArg) {
    const data = this.getCachedData();
    const current_time = Date.now();
    const arg: any = {
      id: $block_id,
      properties,
      format,
      type,
      parent_id: parent_id || data.id,
      parent_table,
      alive: true,
      created_time: current_time,
      created_by_id: this.user_id,
      created_by_table: 'notion_user',
      last_edited_time: current_time,
      last_edited_by_id: this.user_id,
      last_edited_by_table: 'notion_user',
    };
    return this.updateOp([], arg);
  }

  createClass(type: TBlockType, id: string): any {
    const Page = require("./Page");
    const obj = {
      id,
      ...this.getProps(),
      type: "block" as "block"
    };

    switch (type) {
      case "video":
        return new Block<IVideo, IVideoInput>(obj);
      case "audio":
        return new Block<IAudio, IAudioInput>(obj);
      case "image":
        return new Block<IImage, IImageInput>(obj);
      case "bookmark":
        return new Block<IWebBookmark, IWebBookmarkInput>(obj);
      case "code":
        return new Block<ICode, ICodeInput>(obj);
      case "file":
        return new Block<IFile, IFileInput>(obj);
      case "tweet":
        return new Block<ITweet, ITweetInput>(obj);
      case "gist":
        return new Block<IGist, IGistInput>(obj);
      case "codepen":
        return new Block<ICodepen, ICodepenInput>(obj);
      case "maps":
        return new Block<IMaps, IMapsInput>(obj);
      case "figma":
        return new Block<IFigma, IFigmaInput>(obj);
      case "drive":
        return new Block<IDrive, IDriveInput>(obj);
      case "text":
        return new Block<IText, ITextInput>(obj);
      case "table_of_contents":
        return new Block<ITOC, ITOCInput>(obj);
      case "equation":
        return new Block<IEquation, IEquationInput>(obj);
      case "breadcrumb":
        return new Block<IBreadcrumb, IBreadcrumbInput>(obj);
      case "factory":
        return new Block<IFactory, IFactoryInput>(obj);
      case "page":
        return new Page(obj);
      case "text":
        return new Block<IText, ITextInput>(obj);
      case "to_do":
        return new Block<ITodo, ITodoInput>(obj);
      case "header":
        return new Block<IHeader, IHeaderInput>(obj);
      case "sub_header":
        return new Block<ISubHeader, ISubHeaderInput>(obj);
      case "sub_sub_header":
        return new Block<ISubHeader, ISubHeaderInput>(obj);
      case "bulleted_list":
        return new Block<IBulletedList, IBulletedListInput>(obj);
      case "numbered_list":
        return new Block<INumberedList, INumberedListInput>(obj);
      case "toggle":
        return new Block<IToggle, IToggleInput>(obj);
      case "quote":
        return new Block<IQuote, IQuoteInput>(obj);
      case "divider":
        return new Block<IDivider, IDividerInput>(obj);
      case "callout":
        return new Block<ICallout, ICalloutInput>(obj);
      case "toggle":
        return new Block<IToggle, IToggleInput>(obj);
      case "sub_sub_header":
        return new Block<ISubHeader, ISubHeaderInput>(obj);
      case "drive":
        return new Block<IDrive, IDriveInput>(obj);
      default:
        return new Page(obj);
    }
  }
}

export default Block;
