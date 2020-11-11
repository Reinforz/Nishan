import axios from "axios";
import {
  v4 as uuidv4
} from 'uuid';
import fs from "fs";
import path from "path";

import Block from './Block';

import DBArtifacts from "../mixins/DBArtifacts";
import GetItems from "../mixins/GetItems";

import { Operation } from "../utils";

import {
  NishanArg,
  TExportType,
  IOperation,
  Predicate,
  TGenericEmbedBlockType,
  BlockRepostionArg,
  CreateBlockArg,
  CreateRootCollectionViewPageParams,
  PageCreateContentParam,
  UserViewArg,
  ISpaceView,
  SetBookmarkMetadataParams,
  IRootPage, IFactoryInput, TBlockInput, WebBookmarkProps, IPage, TBlock, IPageInput
} from "../types";

/**
 * A class to represent Page type block of Notion
 * @noInheritDoc
 */

class Page<T extends IPage | IRootPage = IPage> extends Block<T, IPageInput> {
  init_cache: boolean;
  constructor(arg: NishanArg) {
    super(arg);
    this.init_cache = false;
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
    dir: string,
    timeZone: string,
    recursive: boolean,
    exportType: TExportType
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
    await this.updateCacheManually([block.id]);

    return new Block({
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
    const block_list_op = this.addToChildArray($block_id, position);
    await this.saveTransactions(
      [
        this.createBlock({
          $block_id,
          type,
          properties,
          format
        }),
        ...content_block_ids.map(content_block_id => Operation.block.listAfter($block_id, ['content'], {
          after: '',
          id: content_block_id
        })),
        block_list_op,
        ...content_blocks
      ]
    );
    await this.updateCacheManually([$block_id]);

    return {
      template: new Block({
        id: $block_id,
        ...this.getProps()
      }),
      contents: content_block_ids.map(content_block_id => new Block({
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
  // TODO FEAT:1:H Connect with other custom content creation methods
  async createContents(contents: PageCreateContentParam[]) {
    const operations: IOperation[] = [], bookmarks: SetBookmarkMetadataParams[] = [], $block_ids: string[] = [], blocks: Block<TBlock, TBlockInput>[] = [];

    for (let index = 0; index < contents.length; index++) {
      const content = contents[index];
      const $block_id = uuidv4();
      $block_ids.push($block_id);

      if (content.type.match(/gist|codepen|tweet|maps|figma/)) {
        content.format = (await this.getGenericEmbedBlockData({
          pageWidth: 500,
          source: (content.properties as any).source[0][0] as string,
          type: content.type as TGenericEmbedBlockType
        })).format;
      };

      const {
        format,
        properties,
        type,
        position
      } = content;

      const block_list_op = this.addToChildArray($block_id, position);

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
        block_list_op
      );

      if (type === "bookmark")
        await this.setBookmarkMetadata({
          blockId: $block_id,
          url: (properties as WebBookmarkProps).link[0][0]
        });

      blocks.push(this.createClass(type, $block_id));

      if (content.file_id && type.match(/image|audio|video/)) operations.push(Operation.block.listAfter($block_id, ['file_ids'], {
        id: content.file_id
      }));
    }

    await this.saveTransactions(operations);
    for (let bookmark of bookmarks)
      await this.setBookmarkMetadata(bookmark)
    await this.updateCacheManually($block_ids);

    return blocks;
  }

  /**
   * Create content for a page 
   * @param options Options for modifying the content during creation
   * @returns Newly created block content object
   */
  async createContent(option: PageCreateContentParam) {
    return (await this.createContents([option]))[0];
  }
}

class DBPage extends DBArtifacts<IPage | IRootPage>(Page) {
  constructor(arg: NishanArg) {
    super(arg);
  }

  // ? FIX:1:M addToChildArray in this method should have the view_ids path rather than content or pages
  /**
   * Creates an inline database block inside current page
   * @param options Views of the newly created inline db block
   * @param position 
   * @returns Returns the newly created inlinedb content block object
   */
  async createInlineDBContent(options: Partial<CreateRootCollectionViewPageParams> = {}) {
    const $collection_view_id = uuidv4(),
      $collection_id = uuidv4();

    const { properties, format, schema, views } = this.createCollection(options, $collection_view_id);

    const view_ids = views.map((view) => view.id);
    const block_list_op = this.addToChildArray($collection_view_id, options.position);
    await this.saveTransactions(
      [
        Operation.block.update($collection_view_id, [], {
          id: $collection_view_id,
          properties,
          format,
          type: 'collection_view',
          view_ids,
          collection_id: $collection_id,
          parent_id: this.id,
          parent_table: "block",
          alive: true,
        }),
        Operation.collection.update($collection_id, [], {
          id: $collection_id,
          schema,
          format: {
            collection_page_properties: []
          },
          parent_id: $collection_view_id,
          parent_table: 'block',
          alive: true,
          name: properties?.title
        }),
        block_list_op,
        ...views
      ]
    );

    return this.createDBArtifacts([[[$collection_view_id, "collection_view"], $collection_id, view_ids]]);
  }

  // ? FEAT:1:M Remove views argument so as to keep the original one?
  /**
   * Create a linked db content block
   * @param collection_id Id of the collectionblock to link with
   * @param views views of the newly created content block
   * @param position `Position` interface
   * @returns Newly created linkedDB block content object
   */
  async createLinkedDBContent(collection_id: string, user_views: UserViewArg[], position?: number | BlockRepostionArg) {
    const data = this.getCachedData();
    const $content_id = uuidv4();

    const { views } = this.createCollection({ views: user_views }, $content_id);
    const view_ids = views.map((view) => view.id);
    const block_list_op = this.addToChildArray($content_id, position);
    await this.saveTransactions(
      [
        Operation.block.set($content_id, [], {
          id: $content_id,
          version: 1,
          type: 'collection_view',
          collection_id,
          view_ids,
          parent_id: data.id,
          parent_table: 'block',
          alive: true,
        }),
        block_list_op,
        ...views,
      ]
    );
    return this.createDBArtifacts([[[data.id, "collection_view"], collection_id, view_ids]]);
  }

  // ? RF:1:M Utilize a util method for Space.createRootCollectionViewPage as well
  /**
   * Create a full page db content block
   * @param option Schema and the views of the newly created block
   * @returns Returns the newly created full page db block object
   */
  async createFullPageDBContent(option: Partial<CreateRootCollectionViewPageParams>) {
    const data = this.getCachedData();
    const { schema, properties, format, views } = this.createCollection(option, data.id);

    const view_ids = views.map((view) => view.id);
    const $collection_id = uuidv4();

    await this.saveTransactions(
      [
        this.updateOp([], {
          id: data.id,
          type: 'collection_view_page',
          collection_id: $collection_id,
          view_ids,
          properties,
          format,
        }),
        Operation.collection.update($collection_id, [], {
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
        ...views
      ]
    );

    return this.createDBArtifacts([[[data.id, "collection_view_page"], $collection_id, view_ids]]);
  }
}

export default class extends GetItems<IRootPage | IPage>(DBPage) {
  constructor(...args: any[]) {
    super(args[0]);
  }

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
  async deleteBlocks(arg: undefined | string[] | Predicate<TBlock>, multiple: boolean = true) {
    await this.deleteItems<TBlock>(arg, multiple)
  }

  /**
   * Get all the blocks of the page as an object
   * @returns An array of block object
   */
  async getBlocks(arg: undefined | string[] | Predicate<TBlock>, multiple: boolean = true): Promise<Block<TBlock, TBlockInput>[]> {
    const _this = this as any;
    return this.getItems<TBlock>(arg, multiple, async function (block) {
      return _this.createClass(block.type, block.id);
    })
  }

  async getBlock(arg: string | Predicate<TBlock>) {
    return (await this.getBlocks(typeof arg === "string" ? [arg] : arg, false))[0];
  }
}