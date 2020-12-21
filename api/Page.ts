import axios from "axios";

import { Operation } from "../utils";

import {
  NishanArg,
  TExportType,
  PageCreateContentParam,
  ISpaceView,
  IPage, TBlock, FilterTypes, FilterType, UpdateTypes, TBlockInput, UpdateType
} from "../types";
import Permissions from "./Permissions";

/**
 * A class to represent Page type block of Notion
 * @noInheritDoc
 */

export default class Page extends Permissions<IPage> {
  constructor(arg: NishanArg) {
    super(arg);
  }

  /* async upload() {
    const res = await this.getUploadFileUrl({
      bucket: "secure",
      contentType: "image/jpeg",
      name: "68sfghkgmvd51.jpg"
    });

    const file_url_chunks = res.url.split("/");
    const file_id = file_url_chunks[file_url_chunks.length - 2];

    await axios.put(res.signedPutUrl);
    await this.createContent({
      type: "image",
      properties: {
        source: [[res.url]]
      },
      format: {
        display_source: res.url
      },
      file_ids: file_id
    } as IImageInput & { file_ids: string });
  } */

  /**
   * Add/remove this page from the favourite list
   */
  async toggleFavourite() {
    const data = this.getCachedData();
    let target_space_view: ISpaceView | null = null;
    for (let [, space_view] of this.cache.space_view) {
      if (space_view.space_id === data.space_id) {
        target_space_view = space_view;
        break;
      }
    };
    if (target_space_view) {
      const is_bookmarked = target_space_view?.bookmarked_pages?.includes(data.id);
      await this.saveTransactions([
        (is_bookmarked ? Operation.space_view.listRemove : Operation.space_view.listBefore)(target_space_view.id, ["bookmarked_pages"], {
          id: data.id
        })
      ])
      await this.updateCacheManually([[target_space_view.id, "space_view"]]);
    }
  }

  /**
   * Export the page and its content as a zip
   * @param arg Options used for setting up export
   */
  // ? FEAT:2:M Add export block method (maybe create a separate class for it as CollectionBlock will also support it)
  async export(arg: {
    timeZone: string,
    recursive: boolean,
    exportType: TExportType
  }) {
    const data = this.getCachedData();
    const {
      timeZone, recursive = true, exportType = "markdown"
    } = arg || {};
    const {
      taskId
    } = await this.enqueueTask({
      eventName: 'exportBlock',
      request: {
        blockId: data.id,
        exportOptions: {
          exportType,
          locale: "en",
          timeZone
        },
        recursive
      }
    });

    const {
      results
    } = await this.getTasks([taskId]);

    const response = await axios.get(results[0].status.exportURL, {
      responseType: 'arraybuffer'
    });

    return response.data;
  }

  /**
   * Batch add multiple block as contents
   * @param contents array of options for configuring each content
   * @returns Array of newly created block content objects
   */
  async createBlocks(contents: PageCreateContentParam[], execute?: boolean) {
    const [ops, sync_records, block_map, { bookmarks }] = await this.nestedContentPopulate(contents, this.id, "block");
    for (let bookmark of bookmarks)
      await this.setBookmarkMetadata(bookmark);
    await this.executeUtil(ops, sync_records, execute)
    return block_map;
  }

  async getBlock(arg?: FilterType<TBlock>) {
    return await this.getBlocks(typeof arg === "string" ? [arg] : arg, false);
  }

  /**
   * Get all the blocks of the page as an object
   * @returns An array of block object
   */
  async getBlocks(args?: FilterTypes<TBlock>, multiple?: boolean) {
    const block_map = this.createBlockMap();
    await this.getIterate<TBlock>(args, { multiple, child_ids: this.getCachedData().content, subject_type: "Block" }, (block_id) => this.cache.block.get(block_id) as TBlock, async (_, block) => {
      block_map[block.type].push(await this.createClass(block.type, block.id))
    });
    return block_map;
  }

  async updateBlock(args: UpdateType<TBlock, TBlockInput>, execute?: boolean) {
    return (await this.updateBlocks(typeof args === "function" ? args : [args], execute, false))
  }

  async updateBlocks(args: UpdateTypes<TBlock, TBlockInput>, execute?: boolean, multiple?: boolean) {
    const block_map = this.createBlockMap();
    await this.updateIterate<TBlock, TBlockInput>(args, {
      multiple,
      execute,
      child_ids: this.getCachedData().content,
      subject_type: "Block",
      child_type: "block"
    }, (child_id) => this.cache.block.get(child_id), async (_, data) => {
      block_map[data.type].push(await this.createClass(data.type, data.id))
    })
    return block_map;
  }

  /**
   * Delete a single block from a page
   * @param arg id string or a predicate acting as a filter
   */
  async deleteBlock(arg?: FilterType<TBlock>, execute?: boolean) {
    return await this.deleteBlocks(typeof arg === "string" ? [arg] : arg, execute, false);
  }

  /**
   * Delete multiple blocks from a page
   * @param arg array of ids or a predicate acting as a filter
   */
  async deleteBlocks(args?: FilterTypes<TBlock>, execute?: boolean, multiple?: boolean) {
    await this.deleteIterate<TBlock>(args, {
      multiple,
      execute,
      child_ids: this.getCachedData().content,
      child_path: "content",
      child_type: "block",
      subject_type: "Block"
    }, (block_id) => this.cache.block.get(block_id));
  }
}