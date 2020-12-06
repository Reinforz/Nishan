import axios from "axios";
import {
  v4 as uuidv4
} from 'uuid';

import Block from './Block';

import { Operation } from "../utils";

import {
  NishanArg,
  TExportType,
  IOperation,
  TGenericEmbedBlockType,
  RepositionParams,
  CreateBlockArg,
  CreateRootCollectionViewPageParams,
  PageCreateContentParam,
  ISpaceView,
  SetBookmarkMetadataParams,
  IRootPage, IFactoryInput, WebBookmarkProps, IPage, TBlock, IPageInput, UpdateCacheManuallyParam, IDriveInput, TBlockType, FilterTypes, ICollection, FilterType, SchemaManipParam, RecordMap, TDataType, ITBlock
} from "../types";
import CollectionViewPage from "./CollectionViewPage";
import CollectionView from "./CollectionView";

const createBlockMap = () => {
  return {
    collection_view_page: [],
    embed: [],
    video: [],
    audio: [],
    image: [],
    bookmark: [],
    code: [],
    file: [],
    tweet: [],
    gist: [],
    codepen: [],
    maps: [],
    figma: [],
    drive: [],
    text: [],
    table_of_contents: [],
    equation: [],
    breadcrumb: [],
    factory: [],
    page: [],
    to_do: [],
    header: [],
    sub_header: [],
    sub_sub_header: [],
    bulleted_list: [],
    numbered_list: [],
    toggle: [],
    quote: [],
    divider: [],
    callout: [],
    collection_view: [],
  } as ITBlock
}

/**
 * A class to represent Page type block of Notion
 * @noInheritDoc
 */

export default class Page<T extends IPage | IRootPage = IPage> extends Block<T, IPageInput> {
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

    /* const fullpath = path.resolve(process.cwd(), dir, 'export.zip');

    fs.createWriteStream(fullpath).end(response.data); */
  }

  /**
   * Create a template block content
   * @param factory `IFactoryInput` interface
   * @param position number or `RepositionParams` interface
   * @returns An object containing Newly created array of template content blocks and the template block itself
   */
  async createTemplateContent(factory: IFactoryInput, position?: RepositionParams) {
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

  async createPageContent(arg: Omit<Partial<IPageInput & { position: RepositionParams }>, "type">) {
    return (await this.createPageContents([arg]))[0]
  }

  async createPageContents(args: Omit<Partial<IPageInput & { position: RepositionParams }>, "type">[]) {
    const operations: IOperation[] = [], block_ids: string[] = [];
    for (let index = 0; index < args.length; index++) {
      const content = args[index];
      const block_id = uuidv4();

      const {
        format,
        properties,
        position,
      } = content;

      block_ids.push(block_id);

      const block_list_op = this.addToChildArray(block_id, position);

      operations.push(this.createBlock({
        $block_id: block_id,
        type: "page",
        properties,
        format,
      }),
        block_list_op
      );
    }

    await this.saveTransactions(operations);
    await this.updateCacheManually(block_ids);
    return block_ids.map(id => new Page({ ...this.getProps(), id }))
  }

  /**
   * Create content for a page 
   * @param options Options for modifying the content during creation
   * @returns Newly created block content object
   */
  async createContent(option: PageCreateContentParam) {
    return (await this.createContents([option]))[0];
  }

  /**
   * Batch add multiple block as contents
   * @param contents array of options for configuring each content
   * @returns Array of newly created block content objects
   */
  // TODO FEAT:1:H Connect with other custom content creation methods
  async createContents(contents: PageCreateContentParam[]) {
    const operations: IOperation[] = [], bookmarks: SetBookmarkMetadataParams[] = [], block_infos: [TBlockType, string][] = [];
    for (let index = 0; index < contents.length; index++) {
      const content = contents[index];
      const $block_id = uuidv4();

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
        position,
      } = content;

      block_infos.push([type, $block_id]);

      const block_list_op = this.addToChildArray($block_id, position);

      if (type === "bookmark") {
        bookmarks.push({
          blockId: $block_id,
          url: (properties as WebBookmarkProps).link[0][0]
        })
        await this.setBookmarkMetadata({
          blockId: $block_id,
          url: (properties as WebBookmarkProps).link[0][0]
        });
      }

      else if (type === "drive") {
        const {
          accounts
        } = await this.getGoogleDriveAccounts();
        await this.initializeGoogleDriveBlock({
          blockId: $block_id,
          fileId: (content as IDriveInput).file_id as string,
          token: accounts[0].token
        });
      }

      operations.push(this.createBlock({
        $block_id,
        type,
        properties,
        format,
      }),
        block_list_op
      );
    }

    await this.saveTransactions(operations);
    for (let bookmark of bookmarks)
      await this.setBookmarkMetadata(bookmark)
    await this.updateCacheManually(block_infos.map(block_info => block_info[1]));
    return block_infos.map(block_info => this.createClass(block_info[0], block_info[1]))
  }

  async createInlineDBContent(option: CreateRootCollectionViewPageParams) {
    return (await this.createInlineDBContents([option]))[0]
  }

  // ? FIX:1:M addToChildArray in this method should have the view_ids path rather than content or pages
  /**
   * Creates an inline database block inside current page
   * @param options Views of the newly created inline db block
   * @param position 
   * @returns Returns the newly created inlinedb content block object
   */
  async createInlineDBContents(options: CreateRootCollectionViewPageParams[]) {
    const ops: IOperation[] = [], collection_view_pages: CollectionViewPage[] = [], sync_records: UpdateCacheManuallyParam = [];

    for (let index = 0; index < options.length; index++) {
      const option = options[index],
        { properties, format } = option,
        block_id = uuidv4(), [collection_id, create_view_ops, view_info] = this.createCollection(option, block_id);

      ops.push(Operation.block.update(block_id, [], {
        id: block_id,
        properties,
        format,
        type: 'collection_view',
        view_ids: view_info.map(view_info => view_info[0]),
        collection_id,
        parent_id: this.id,
        parent_table: "block",
        alive: true,
      }),
        ...create_view_ops,
        this.addToChildArray(block_id, option.position),
      )
      sync_records.push(block_id, [collection_id, "collection"], ...view_info.map(view_info => [view_info[0], "collection_view"] as [string, TDataType]))
      collection_view_pages.push(new CollectionViewPage({
        ...this.getProps(),
        id: block_id
      }))
    }

    await this.saveTransactions(ops);
    await this.updateCacheManually(sync_records);
    return collection_view_pages;

  }

  // ? FEAT:1:M Remove views argument so as to keep the original one?
  // ? FEAT:1:H Iterate through each schema_unit to add specific filter, aggregation and sorts
  /**
   * Create a linked db content block
   * @param collection_id Id of the collectionblock to link with
   * @param views views of the newly created content block
   * @param position `Position` interface
   * @returns Newly created linkedDB block content object
   */
  async createLinkedDBContent(arg: (SchemaManipParam & { collection_id: string })) {
    return (await this.createLinkedDBContents([arg]))[0]
  }

  async createLinkedDBContents(args: (SchemaManipParam & { collection_id: string })[]) {
    const ops: IOperation[] = [], content_ids: UpdateCacheManuallyParam = [];
    for (let index = 0; index < args.length; index++) {
      const { collection_id, views, position } = args[index],
        content_id = uuidv4(),
        collection = this.cache.collection.get(collection_id) as ICollection,
        [created_view_ops, view_info] = this.createViewsUtils(collection.schema, views, collection.id, content_id);

      ops.push(Operation.block.set(content_id, [], {
        id: content_id,
        version: 1,
        type: 'collection_view',
        collection_id,
        view_ids: view_info.map(view_info => view_info[0]),
        parent_id: this.id,
        parent_table: 'block',
        alive: true,
      }),
        this.addToChildArray(content_id, position), ...created_view_ops);
      content_ids.push(content_id, [collection_id, "collection"], ...view_info.map(view_info => [view_info[0], "collection_view"] as [string, keyof RecordMap]));
    }

    await this.saveTransactions(ops);
    await this.updateCacheManually(content_ids);
    return content_ids.filter(content_id => typeof content_id === "string").map(id => new CollectionView({
      ...this.getProps(),
      id: id as string
    }))
  }

  async createFullPageDBContent(option: CreateRootCollectionViewPageParams) {
    return (await this.createFullPageDBContents([option]))[0];
  }

  // ? RF:1:M Utilize a util method for Space.createRootCollectionViewPage as well
  /**
   * Create a full page db content block
   * @param option Schema and the views of the newly created block
   * @returns Returns the newly created full page db block object
   */
  async createFullPageDBContents(options: CreateRootCollectionViewPageParams[]) {
    const data = this.getCachedData(), ops: IOperation[] = [], collection_view_pages: CollectionViewPage[] = [], sync_records: UpdateCacheManuallyParam = [];

    for (let index = 0; index < options.length; index++) {
      const option = options[index],
        { properties, format } = option,
        block_id = uuidv4(), [collection_id, create_view_ops, view_info] = this.createCollection(option, block_id);
      ops.push(Operation.block.update(block_id, [], {
        id: data.id,
        type: 'collection_view_page',
        collection_id,
        view_ids: view_info.map(view_info => view_info[0]),
        properties,
        format,
      }),
        ...create_view_ops,
        this.addToChildArray(block_id, option.position),
      )

      sync_records.push(block_id, [collection_id, "collection"], ...view_info.map(view_info => [view_info[0], "collection_view"] as [string, TDataType]))
      collection_view_pages.push(new CollectionViewPage({
        ...this.getProps(),
        id: block_id
      }))
    }
    await this.saveTransactions(ops);
    await this.updateCacheManually(sync_records);
    return collection_view_pages;
  }

  async getBlock(arg?: FilterType<TBlock>) {
    return await this.getBlocks(typeof arg === "string" ? [arg] : arg, false);
  }

  /**
   * Get all the blocks of the page as an object
   * @returns An array of block object
   */
  async getBlocks(args?: FilterTypes<TBlock>, multiple?: boolean) {
    multiple = multiple ?? true;
    const _this = this, block_map = createBlockMap();
    await this.getItems<TBlock>(args, multiple, async function (block) {
      block_map[block.type].push(_this.createClass(block.type, block.id) as any)
    })
    return block_map;
  }

  /**
   * Delete a single block from a page
   * @param arg id string or a predicate acting as a filter
   */
  async deleteBlock(arg?: FilterType<TBlock>) {
    return await this.deleteBlocks(typeof arg === "string" ? [arg] : arg, false);
  }

  /**
   * Delete multiple blocks from a page
   * @param arg array of ids or a predicate acting as a filter
   */
  async deleteBlocks(args?: FilterTypes<TBlock>, multiple?: boolean) {
    multiple = multiple ?? true;
    await this.deleteItems<TBlock>(args, multiple)
  }
}