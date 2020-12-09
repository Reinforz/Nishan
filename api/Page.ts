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
  CreateBlockArg,
  PageCreateContentParam,
  ISpaceView,
  SetBookmarkMetadataParams,
  IRootPage, WebBookmarkProps, IPage, TBlock, IPageInput, UpdateCacheManuallyParam, IDriveInput, FilterTypes, ICollection, FilterType, RecordMap, TDataType, ITCollectionBlock, IFactory, IFactoryInput, ICollectionBlockInput
} from "../types";
import CollectionViewPage from "./CollectionViewPage";
import CollectionView from "./CollectionView";
import Collection from "./Collection";
import { BoardView, GalleryView, ListView, TimelineView, TableView, CalendarView } from ".";

const view_class = {
  board: BoardView,
  gallery: GalleryView,
  list: ListView,
  timeline: TimelineView,
  table: TableView,
  calendar: CalendarView,
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
  }

  /**
   * Batch add multiple block as contents
   * @param contents array of options for configuring each content
   * @returns Array of newly created block content objects
   */
  async createContents(contents: PageCreateContentParam[]) {
    const ops: IOperation[] = [], bookmarks: SetBookmarkMetadataParams[] = [], sync_records: UpdateCacheManuallyParam = [], block_map = this.createBlockMap();
    for (let index = 0; index < contents.length; index++) {
      const content = contents[index], $block_id = uuidv4();
      sync_records.push($block_id);

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

      if (type === "collection_view_page" || type === "collection_view") {
        const [collection_id, create_view_ops, view_infos] = this.createCollection(content as ICollectionBlockInput, $block_id);
        ops.push(Operation.block.update($block_id, [], {
          id: $block_id,
          type,
          collection_id,
          view_ids: view_infos.map(view_info => view_info[0]),
          properties,
          format,
          parent_id: this.id,
          parent_table: 'block',
          alive: true,
        }),
          ...create_view_ops,
          this.addToChildArray($block_id, position),
        )

        const collectionblock_map: ITCollectionBlock = {
          block: type === "collection_view" ? new CollectionView({
            ...this.getProps(),
            id: $block_id
          }) : new CollectionViewPage({
            ...this.getProps(),
            id: $block_id
          }),
          collection: new Collection({
            id: collection_id,
            ...this.getProps()
          }),
          views: this.createViewMap()
        }

        view_infos.map(([view_id, view_type]) => collectionblock_map.views[view_type].push(new view_class[view_type]({
          ...this.getProps(),
          id: view_id
        }) as any))

        sync_records.push([collection_id, "collection"], ...view_infos.map(view_info => [view_info[0], "collection_view"] as [string, TDataType]))
        block_map[type].push(collectionblock_map)
      } else if (content.type === "factory") {
        const factory_contents_map = this.createBlockMap(), content_ids: string[] = [], content_blocks_ops = (content.contents.map(content => ({
          ...content,
          $block_id: uuidv4()
        })) as CreateBlockArg[]).map(content => {
          const obj = this.createBlock({ ...content, parent_id: $block_id });
          factory_contents_map[content.type].push(this.createClass(content.type, content.$block_id) as any)
          sync_records.push(content.$block_id)
          content_ids.push(content.$block_id);
          return obj;
        });
        ops.push(
          Operation.block.update($block_id, [], {
            id: $block_id,
            properties,
            format,
            type,
            parent_id: this.id,
            parent_table: "block",
            alive: true,
            content: content_ids
          }),
          this.addToChildArray($block_id, position),
          ...content_blocks_ops
        );
        block_map.factory.push({
          block: new Block<IFactory, IFactoryInput>({
            id: $block_id,
            ...this.getProps()
          }), contents: factory_contents_map
        })
      }
      else if (content.type === "linked_db") {
        const { collection_id, views, position } = content,
          collection = this.cache.collection.get(collection_id) as ICollection,
          [created_view_ops, view_infos] = this.createViewsUtils(collection.schema, views, collection.id, $block_id);

        ops.push(Operation.block.set($block_id, [], {
          id: $block_id,
          version: 1,
          type: 'collection_view',
          collection_id,
          view_ids: view_infos.map(view_info => view_info[0]),
          parent_id: this.id,
          parent_table: 'block',
          alive: true,
        }),
          this.addToChildArray($block_id, position), ...created_view_ops);
        sync_records.push([collection_id, "collection"], ...view_infos.map(view_info => [view_info[0], "collection_view"] as [string, keyof RecordMap]));
        const collectionblock_map: ITCollectionBlock = {
          block: new CollectionView({
            ...this.getProps(),
            id: $block_id
          }),
          collection: new Collection({
            id: collection_id,
            ...this.getProps()
          }),
          views: this.createViewMap()
        }

        view_infos.map(([view_id, view_type]) => collectionblock_map.views[view_type].push(new view_class[view_type]({
          ...this.getProps(),
          id: view_id
        }) as any))

        block_map[content.type].push(collectionblock_map)
      }

      else {
        ops.push(this.createBlock({
          $block_id,
          type: content.type,
          properties,
          format,
        }),
          this.addToChildArray($block_id, position)
        );
        sync_records.push($block_id);
        block_map[type].push(await this.createClass(content.type, $block_id));
      }
    }

    await this.saveTransactions(ops);
    for (let bookmark of bookmarks)
      await this.setBookmarkMetadata(bookmark)
    await this.updateCacheManually(sync_records);
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
    multiple = multiple ?? true;
    const _this = this, block_map = this.createBlockMap();
    await this.getItems<TBlock>(args, multiple, async function (block) {
      block_map[block.type].push(await _this.createClass(block.type, block.id))
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