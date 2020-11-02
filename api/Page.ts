import axios from "axios";
import {
  v4 as uuidv4
} from 'uuid';
import fs from "fs";
import path from "path";

import Block from './Block';
import CollectionViewPage from './CollectionViewPage';
import CollectionView from './CollectionView';

import createViews from "../utils/createViews";

import {
  collectionUpdate,
  blockUpdate,
  blockSet,
  blockListAfter,
  spaceViewListBefore,
  spaceViewListRemove,
} from '../utils/chunk';

import {
  error,
} from "../utils/logs";

import {
  NishanArg,
  ExportType,
  Operation,
  Predicate,
  TGenericEmbedBlockType,
} from "../types/types";
import {
  BlockRepostionArg,
  CreateBlockArg,
  CreateRootCollectionViewPageParams,
  UserViewArg,
} from "../types/function";
import {
  ISpaceView,
  SetBookmarkMetadataParams
} from "../types/api";
import { IRootPage, IFactoryInput, TBlockInput, WebBookmarkProps, IPage, TBlock, IPageInput } from "../types/block";

/**
 * A class to represent Page type block of Notion
 * @noInheritDoc
 */
class Page<T extends IPage | IRootPage> extends Block<T, IPageInput> {
  init_cache: boolean;
  constructor(arg: NishanArg) {
    super(arg);
    this.init_cache = false;
  }

  async initializeCache() {
    if (!this.init_cache) {
      await this.loadPageChunk({
        chunkNumber: 0,
        cursor: {
          stack: []
        },
        limit: 50,
        pageId: this.id,
        verticalColumns: false
      });
      this.init_cache = true;
    }
  }

  /**
   * Get all the blocks of the page as an object
   * @returns An array of block object
   */
  async getBlocks(arg: undefined | string[] | Predicate<TBlock>, multiple: boolean = true) {
    await this.initializeCache();
    const data = this.getCachedData();
    const blocks: Block<TBlock, TBlockInput>[] = [];

    if (data.content) {
      if (Array.isArray(arg)) {
        for (let index = 0; index < arg.length; index++) {
          const block_id = arg[index], block = this.getCachedData(block_id);
          let should_add = data.content.includes(block_id);
          if (should_add) {
            blocks.push(this.createClass(block.type, block_id));
          }
          if (!multiple && blocks.length === 1) break;
        }
      } else if (typeof arg === "function" || arg === undefined) {
        for (let index = 0; index < data.content.length; index++) {
          const block_id = data.content[index], block: TBlock = this.getCachedData(block_id);
          let should_add = typeof arg === "function" ? await arg(block, index) : true;
          if (should_add) blocks.push(this.createClass(block.type, block_id))
          if (!multiple && blocks.length === 1) break;
        }
      }
      return blocks;
    } else
      throw new Error(error("This page doesnot have any content"));
  }

  async getBlock(arg: string | Predicate<TBlock>) {
    return (await this.getBlocks(typeof arg === "string" ? [arg] : arg, false))[0]
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
   * Delete a single block from a page
   * @param arg id string or a predicate acting as a filter
   */
  async deleteBlock(arg: string | Predicate<TBlock>) {
    return await this.deleteBlocks(typeof arg === "string" ? [arg] : arg, false);
  }

  /**
   * Delete multiple blocks from a page
   * @param arg array of ids or a predicate acting as a filter
   */
  async deleteBlocks(arg: string[] | Predicate<TBlock>, multiple: boolean = true) {
    await this.initializeCache();
    const data = this.getCachedData(), ops: Operation[] = [], current_time = Date.now(), ids: string[] = [];
    if (data.content) {
      if (Array.isArray(arg)) {
        for (let index = 0; index < arg.length; index++) {
          const id = arg[index];
          if (data.content.includes(id))
            ids.push(id);
          else
            throw new Error(error(`This page is not the parent of the block with id ${id}`))
          if (!multiple && ids.length === 1) break;
        }
      } else if (typeof arg === "function") {
        for (let index = 0; index < data.content.length; index++) {
          const block_id = data.content[index];
          const block = this.getCachedData(block_id);
          if (block.parent_id === data.id && await arg(block, index))
            ids.push(block_id);
          if (!multiple && ids.length === 1) break;
        }
      }
    };

    ids.forEach(id => ops.push(blockUpdate(id, [], {
      alive: false,
      last_edited_time: current_time
    }), this.listRemoveOp(['content'], {
      id
    })));

    ops.push(this.setOp(['last_edited_time'], current_time))
    await this.saveTransactions(ops);
    // ? FIX:1:H Delete related data for example for collection_view delete the collection and the views from cache
    ids.forEach(id => this.cache.block.delete(id));
  }

  /**
   * Add/remove this page from the favourite list
   */
  async toggleFavourite() {
    await this.loadUserContent();
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
        (is_bookmarked ? spaceViewListRemove : spaceViewListBefore)(target_space_view.id, ["bookmarked_pages"], {
          id: data.id
        })
      ])
    }
  }

  /**
   * Export the page and its content as a zip
   * @param arg Options used for setting up export
   */
  // ? FEAT:2:M Add export block method (maybe create a separate class for it as CollectionBlock will also support it)
  async export(arg: {
    dir: string,
    timeZone: string,
    recursive: boolean,
    exportType: ExportType
  }) {
    const data = this.getCachedData();
    const {
      dir = "output", timeZone, recursive = true, exportType = "markdown"
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

    const fullpath = path.resolve(process.cwd(), dir, 'export.zip');

    fs.createWriteStream(fullpath).end(response.data);
  }

  /**
   * Create a google drive content as a block
   * @param fileId id of the file to link in the block
   * @param position `Position` interface
   * @returns Newly created drive content block
   */
  async createDriveContent(fileId: string, position?: number | BlockRepostionArg) {
    const {
      accounts
    } = await this.getGoogleDriveAccounts();
    const block = await this.createContent({
      type: "drive",
      position
    });
    await this.initializeGoogleDriveBlock({
      blockId: block.id,
      fileId,
      token: accounts[0].token
    });
    await this.addToCachedData("block", block.id)
    await this.updateCacheLocally
    return new Block({
      type: "block",
      id: block.id,
      ...this.getProps()
    });
  }

  /**
   * Create a template block content
   * @param factory `IFactoryInput` interface
   * @param position number or `BlockRepostionArg` interface
   * @returns An object containing Newly created array of template content blocks and the template block itself
   */
  async createTemplateContent(factory: IFactoryInput, position?: number | BlockRepostionArg) {
    const {
      format,
      properties,
      type
    } = factory;
    const $block_id = uuidv4();
    const content_blocks = (factory.contents.map(content => ({
      ...content,
      $block_id: uuidv4()
    })) as CreateBlockArg[]).map(content => {
      const obj = this.createBlock(content);
      obj.args.parent_id = $block_id;
      return obj;
    });

    const content_block_ids = content_blocks.map(content_block => content_block.id);
    const [block_list_op] = this.addToChildArray($block_id, position);
    await this.saveTransactions(
      [
        this.createBlock({
          $block_id,
          type,
          properties,
          format
        }),
        ...content_block_ids.map(content_block_id => blockListAfter($block_id, ['content'], {
          after: '',
          id: content_block_id
        })),
        block_list_op,
        ...content_blocks
      ]
    );

    return {
      template: new Block({
        type: "block",
        id: $block_id,
        ...this.getProps()
      }),
      contents: content_block_ids.map(content_block_id => new Block({
        type: "block",
        id: content_block_id,
        ...this.getProps()
      }))
    }

  }

  /**
   * Batch add multiple block as contents
   * @param contents array of options for configuring each content
   * @returns Array of newly created block content objects
   */

  async createContents(contents: (TBlockInput & {
    position?: number | BlockRepostionArg
  })[]) {

    const data = this.getCachedData();
    const operations: Operation[] = [];
    const bookmarks: SetBookmarkMetadataParams[] = [];
    const $block_ids: string[] = [];

    contents.forEach(content => {
      const {
        format,
        properties,
        type,
        position
      } = content;
      const $block_id = uuidv4();
      $block_ids.push($block_id);
      // ? FEAT:1:M Update multiple items
      const [block_list_op] = this.addToChildArray($block_id, position);

      if (type === "bookmark")
        bookmarks.push({
          blockId: $block_id,
          url: (properties as WebBookmarkProps).link[0][0]
        })
      operations.push(this.createBlock({
        $block_id,
        type,
        properties,
        format,
      }),
        block_list_op);
    });

    await this.saveTransactions(operations);
    for (let bookmark of bookmarks) {
      await this.setBookmarkMetadata(bookmark)
    }


    const recordMap = await this.loadPageChunk({
      chunkNumber: 0,
      cursor: {
        stack: []
      },
      limit: 100,
      pageId: data.id,
      verticalColumns: false
    });

    const blocks: Block<TBlock, TBlockInput>[] = [];

    $block_ids.forEach($block_id => {
      const block = recordMap.block[$block_id].value;
      if (block.type === "page") blocks.push(new Page({
        type: "block",
        id: block.id,
        ...this.getProps()
      }));

      else if (block.type === "collection_view") blocks.push(new CollectionView({
        type: "collection_view",
        id: block.id,
        ...this.getProps(),
      }));

      else blocks.push(this.createClass(block.type, $block_id));

    });

    if (!data.content) data.content = $block_ids;
    else
      data.content.push(...$block_ids);

    const cached_data = this.cache.block.get(data.id) as IPage;
    cached_data?.content?.push(...$block_ids);

    return blocks;

  }

  // ? RF:1:M Refactor to use createContents function
  /**
   * Create content for a page 
   * @param options Options for modifying the content during creation
   * @returns Newly created block content object
   */
  async createContent(options: TBlockInput & {
    file_id?: string,
    position?: number | BlockRepostionArg
  }) {
    const data = this.getCachedData();
    const $block_id = uuidv4();
    if (!data.content) data.content = []

    if (options.type.match(/gist|codepen|tweet|maps|figma/)) {
      options.format = (await this.getGenericEmbedBlockData({
        pageWidth: 500,
        source: (options.properties as any).source[0][0] as string,
        type: options.type as TGenericEmbedBlockType
      })).format;
    };

    const [block_list_op, update] = this.addToChildArray($block_id, options.position);

    const {
      format,
      properties,
      type
    } = options;

    const operations = [
      this.createBlock({
        $block_id,
        type,
        properties,
        format,
      }),
      block_list_op,
    ];

    if (type.match(/image|audio|video/)) operations.push(blockListAfter($block_id, ['file_ids'], {
      id: options.file_id
    }));

    await this.saveTransactions(
      operations
    );

    if (type === "bookmark")
      await this.setBookmarkMetadata({
        blockId: $block_id,
        url: (properties as WebBookmarkProps).link[0][0]
      })


    update();
    return this.createClass(type, $block_id);
  }

  /**
   * Create a linked db content block
   * @param collection_id Id of the collectionblock to link with
   * @param views views of the newly created content block
   * @param position `Position` interface
   * @returns Newly created linkedDB block content object
   */
  async createLinkedDBContent(collection_id: string, views: UserViewArg[] = [], position?: number | BlockRepostionArg) {
    const data = this.getCachedData();
    const $content_id = uuidv4();
    const $views = views.map((view) => ({
      ...view,
      id: uuidv4()
    }));
    const view_ids = $views.map((view) => view.id);
    const current_time = Date.now();
    const [block_list_op, update] = this.addToChildArray($content_id, position);
    await this.saveTransactions(
      [
        ...createViews($views, $content_id),
        blockSet($content_id, [], {
          id: $content_id,
          version: 1,
          type: 'collection_view',
          collection_id,
          view_ids,
          parent_id: data.id,
          parent_table: 'block',
          alive: true,
          created_by_table: 'notion_user',
          created_by_id: this.user_id,
          created_time: current_time,
          last_edited_by_table: 'notion_user',
          last_edited_by_id: this.user_id,
          last_edited_time: current_time
        }),
        block_list_op,
        blockSet($content_id, ['last_edited_time'], current_time)
      ]
    );

    update();
    return new CollectionView({
      type: "collection_view",
      ...this.getProps(),
      id: $content_id
    });

  }

  // ? RF:1:M Utilize a util method for Space.createRootCollectionViewPage as well
  /**
   * Create a full page db content block
   * @param option Schema and the views of the newly created block
   * @returns Returns the newly created full page db block object
   */
  async createFullPageDBContent(option: Partial<CreateRootCollectionViewPageParams>) {
    const data = this.getCachedData();
    const { schema, properties, format, views } = this.parseCollectionOptions(option);

    const view_ids = views.map((view) => view.id);
    const $collection_id = uuidv4();
    const current_time = Date.now();

    await this.saveTransactions(
      [
        this.updateOp([], {
          id: data.id,
          type: 'collection_view_page',
          collection_id: $collection_id,
          view_ids,
          properties,
          format,
          created_time: current_time,
          last_edited_time: current_time
        }),
        collectionUpdate($collection_id, [], {
          id: $collection_id,
          schema,
          format: {
            collection_page_properties: []
          },
          icon: data.format.page_icon,
          parent_id: data.id,
          parent_table: 'block',
          alive: true,
          name: data.properties.title
        }),
        ...createViews(views, data.id)
      ]
    );

    return new CollectionViewPage({
      type: "block",
      ...this.getProps(),
      id: data.id
    })

  }

  // ? FEAT:1:M Take in Schema as an option
  /**
   * Creates an inline database block inside current page
   * @param options Views of the newly created inline db block
   * @param position 
   * @returns Returns the newly created inlinedb content block object
   */
  async createInlineDBContent(options: {
    views?: UserViewArg[]
  } = {}, position?: number | BlockRepostionArg) {
    // ? FEAT:1:M Task in schema

    const data = this.getCachedData();
    const $collection_view_id = uuidv4();
    const $collection_id = uuidv4();
    const views = (options.views && options.views.map((view) => ({
      ...view,
      id: uuidv4()
    }))) || [];
    const [block_list_op] = this.addToChildArray($collection_view_id, position);
    await this.saveTransactions(
      [
        this.createBlock({
          $block_id: $collection_view_id,
          properties: {},
          format: {},
          type: 'collection_view'
        }),
        ...createViews(views, data.id),
        collectionUpdate($collection_id, [], {
          id: $collection_id,
          schema: {
            title: {
              name: 'Name',
              type: 'title'
            }
          },
          format: {
            collection_page_properties: []
          },
          parent_id: $collection_view_id,
          parent_table: 'block',
          alive: true
        }),
        block_list_op
      ]
    );


    return new CollectionView({
      type: "collection_view",
      ...this.getProps(),
      id: $collection_view_id
    })
  }
}

export default Page;