import { Mutations } from "@nishans/endpoints";
import { Operation } from "@nishans/operations";
import { IPage, ISpace, ISpaceView, TExportType, TBlock } from "@nishans/types";
import { NotionPermissions } from "../src";

import { NishanArg, TBlockCreateInput, FilterType, FilterTypes, UpdateType, TBlockInput, UpdateTypes, IBlockMap, IPageCreateInput } from "../types";
import { createBlockClass, createBlockMap, createContents, CreateData, transformToMultiple } from "../utils";
import Block from "./Block";


/**
 * A class to represent Page type block of Notion
 * @noInheritDoc
 */

export default class Page extends Block<IPage, IPageCreateInput> {
	Permissions: NotionPermissions;
  
  constructor(arg: NishanArg) {
    super(arg);
		this.Permissions = new NotionPermissions(arg, arg.id, 'block');
  }

  getCachedParentData() {
    const data = this.getCachedData();
    if (data.parent_table === "space") return this.cache.space.get(data.parent_id) as ISpace;
    else return this.cache.block.get(data.parent_id) as IPage;
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
    let target_space_view: ISpaceView = null as any;
    for (const [, space_view] of this.cache.space_view) {
      if (space_view.space_id === data.space_id) {
        target_space_view = space_view;
        break;
      }
    };

    let is_bookmarked = false;
    if(target_space_view.bookmarked_pages){
      is_bookmarked = target_space_view.bookmarked_pages?.includes(data.id);
      if(is_bookmarked)
        target_space_view.bookmarked_pages = target_space_view.bookmarked_pages.filter(id=>id !== this.id);
      else target_space_view.bookmarked_pages.push(this.id);
    }

    this.Operations.stack.push(
      (is_bookmarked ? Operation.space_view.listRemove : Operation.space_view.listBefore)(target_space_view.id, ["bookmarked_pages"], {
        id: data.id
      })
    )
  }

  /**
   * Export the page and its content as a zip
   * @param arg Options used for setting up export
   */
  // ? FEAT:2:M Add export block method (maybe create a separate class for it as CollectionBlock will also support it)
  async export(arg: Partial<{
    timeZone: string,
    recursive: boolean,
    exportType: TExportType
  }>) {
    const data = this.getCachedData();
    const {
      timeZone = "", recursive = true, exportType = "markdown"
    } = arg;
    const {
      taskId
    } = await Mutations.enqueueTask({
      task: {
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
      }
    }, {
      token: this.token,
      interval: this.interval
    });

    /* await this.getTasks({taskIds: [taskId]});

    const response = await axios.get(results[0].status.exportURL, {
      responseType: 'arraybuffer'
    });

    return response.data; */
  }

  /**
   * Batch add multiple block as contents
   * @param contents array of options for configuring each content
   * @returns Array of newly created block content objects
   */
  async createBlocks(contents: TBlockCreateInput[]) {
    return await CreateData.createContents(contents, this.id, this.type as "block", this.getProps())
  }

  async getBlock(arg?: FilterType<TBlock>) {
    return await this.getBlocks(transformToMultiple(arg), false);
  }

  /**
   * Get all the blocks of the page as an object
   * @returns An array of block object
   */
  async getBlocks(args?: FilterTypes<TBlock>, multiple?: boolean) {
    return await this.getIterate<TBlock, IBlockMap>(args, { container: createBlockMap(), multiple, child_ids: "content", child_type: "block" }, (block_id) => this.cache.block.get(block_id) as TBlock, (_, block, block_map) => {
      const block_obj = createBlockClass(block.type, block.id, this.getProps());
      if(block.type === "page")
        block_map[block.type].set(block.properties.title[0][0], block_obj)
      else if(block.type === "collection_view" || block.type === "collection_view_page"){
        const collection = this.cache.collection.get(block.collection_id);
        if(collection)
          block_map[block.type].set(collection.name[0][0], block_obj)
      }
      block_map[block.type].set(block.id, block_obj)
    });
  }

  async updateBlock(args: UpdateType<TBlock, TBlockInput>) {
    return (await this.updateBlocks(typeof args === "function" ? args : [args],  false))
  }

  async updateBlocks(args: UpdateTypes<TBlock, TBlockInput>, multiple?: boolean) {
    return await this.updateIterate<TBlock, TBlockInput, IBlockMap>(args, {
      multiple,
      child_ids: "content",
      child_type: "block",
      container: createBlockMap()
    }, (child_id) => this.cache.block.get(child_id), (_, block,__,block_map) => {
      const block_obj = createBlockClass(block.type, block.id, this.getProps());
      if(block.type === "page")
        block_map[block.type].set(block.properties.title[0][0], block_obj)
      else if(block.type === "collection_view" || block.type === "collection_view_page"){
        const collection = this.cache.collection.get(block.collection_id);
        if(collection)
          block_map[block.type].set(collection.name[0][0], block_obj)
      }
      block_map[block.type].set(block.id, block_obj)
    })
  }

  /**
   * Delete a single block from a page
   * @param arg id string or a predicate acting as a filter
   */
  async deleteBlock(arg?: FilterType<TBlock>) {
    return await this.deleteBlocks(transformToMultiple(arg),  false);
  }

  /**
   * Delete multiple blocks from a page
   * @param arg array of ids or a predicate acting as a filter
   */
  async deleteBlocks(args?: FilterTypes<TBlock>, multiple?: boolean) {
    await this.deleteIterate<TBlock>(args, {
      multiple,
      child_ids: 'content',
      child_path: "content",
      child_type: "block",
      container: []
    }, (block_id) => this.cache.block.get(block_id));
  }
}