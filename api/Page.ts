import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import path from "path";

import Block from './Block';
import CollectionViewPage from './CollectionViewPage';
import CollectionView from './CollectionView';
import Collection from './Collection';

import createViews from "../utils/createViews";

import { collectionUpdate, lastEditOperations, createOperation, blockUpdate, blockSet, blockListAfter, spaceViewListBefore, spaceViewListRemove } from '../utils/chunk';

import { error, warn } from "../utils/logs";

import { QueryCollectionResult, Page as IPage, PageFormat, PageProps, Schema, SchemaUnitType, UserViewArg, CollectionViewPage as ICollectionViewPage, NishanArg, BlockType, ExportType, SpaceView, LoadPageChunkResult, RecordMap } from "../types";

class Page extends Block {
  block_data: IPage;

  constructor(arg: NishanArg & { block_data: IPage }) {
    super(arg);
    if (arg.block_data.type !== 'page') throw new Error(error(`Cannot create page block from ${arg.block_data.type} block`));
    this.block_data = arg.block_data;
  }

  // ? RF:1:H Add All api function utils
  async loadPageChunk(limit: number = 100): Promise<RecordMap> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const res = await axios.post(
            'https://www.notion.so/api/v3/loadPageChunk',
            {
              pageId: this.block_data.id,
              limit,
              chunkNumber: 0,
              cursor: { stack: [] },
              verticalColumns: false
            },
            this.headers
          ) as { data: LoadPageChunkResult };
          this.saveToCache(res.data.recordMap);
          resolve(res.data.recordMap);
        } catch (err) {
          reject(error(err.response.data))
        }
      })
    })
  }

  /**
   * Update the properties and the format of the page
   * @param opts The format and properties of the page to update
   */
  async update(opts: { format: Partial<PageFormat>, properties: Partial<PageProps> } = { format: {}, properties: {} }) {
    const { format = {}, properties = {} } = opts;
    await this.saveTransactions([[
      blockUpdate(this.block_data.id, ['format'], format),
      blockUpdate(this.block_data.id, ['properties'], properties),
      blockSet(this.block_data.id, ['last_edited_time'], Date.now())
    ]])
  }

  /**
   * Add/remove this page from the favourite list
   */
  async toggleFavourite() {
    try {
      await this.loadUserContent();
      let target_space_view: SpaceView | null = null;
      for (let [, space_view] of this.cache.space_view) {
        if (space_view.space_id === this.block_data.space_id) {
          target_space_view = space_view;
          break;
        }
      };
      if (target_space_view) {
        const is_bookmarked = target_space_view.bookmarked_pages && target_space_view.bookmarked_pages.includes(this.block_data.id);
        await this.saveTransactions([[
          (is_bookmarked ? spaceViewListRemove : spaceViewListBefore)(target_space_view.id, ["bookmarked_pages"], { id: this.block_data.id })
        ]])
      }
    } catch (err) {
      throw new Error(error(err.response.data));
    }
  }

  /**
   * Add a page as a linked page to current page
   * @param $block_id Id of the page to add as a linked page
   */
  async createLinkedPageContent($block_id: string) {
    const parent_id = this.block_data.id;
    await this.saveTransactions([[
      blockListAfter(parent_id, ['content'], { after: '', id: $block_id }),
      ...lastEditOperations(parent_id, this.user_id)
    ]]);
  }

  // ? FEAT:1:M Add mention a person/page/date content
  async createMentionBlockContent() {

  }

  // ? FEAT:1:E Add inline equation content
  async createInlineEquationContent() {

  }

  /**
   * 
   * @param opts  
   */
  async createImageContent(opts: { source: string, caption?: string[][] }) {
    const { source, caption = [['']] } = opts;
    const $block_id = uuidv4();
    const current_time = Date.now();
    await this.saveTransactions([[
      this.createBlock({
        $block_id,
        properties: {
          source,
          caption
        },
        format: {
          display_source: source
        },
        type: 'image'
      }),
      blockListAfter(this.block_data.id, ['content'], { after: '', id: $block_id }),
      blockUpdate(this.block_data.id, [], {
        last_edited_time: current_time,
        last_edited_by_id: this.user_id,
      })
    ]]);

    const res = await this.loadPageChunk();
    return new Block({
      block_data: res.block[$block_id].value,
      ...this.getProps()
    })
  }

  /**
   * Export the page and its content as a zip
   * @param arg Options used for setting up export
   */
  // ? FEAT:2:M Add export block method (maybe create a separate class for it as CollectionViewPage will also support it)
  async export(arg: { dir: string, timeZone: string, recursive: boolean, exportType: ExportType }) {
    const { dir = "output", timeZone, recursive = true, exportType = "markdown" } = arg || {};
    try {
      const { data: { taskId } } = await axios.post('https://www.notion.so/api/v3/enqueueTask', {
        task: {
          eventName: 'exportBlock',
          request: {
            blockId: this.block_data.id,
            exportOptions: {
              exportType,
              locale: "en",
              timeZone
            },
            recursive
          }
        }
      }, this.headers);
      setTimeout(async () => {
        const { data: { results } } = await axios.post('https://www.notion.so/api/v3/getTasks', { taskIds: [taskId] }, this.headers);
        const response = await axios.get(results[0].status.exportURL, {
          responseType: 'arraybuffer'
        });
        const fullpath = path.resolve(process.cwd(), dir, 'export.zip');

        fs.createWriteStream(fullpath).end(response.data);
      }, this.interval)
    } catch (err) {
      throw new Error(error(err.response.data))
    }
  }

  /**
   * Create contents for a page except **linked Database** and **Collection view** block
   * @param {ContentOptions} options Options for modifying the content during creation
   */
  // ? TD:1 ContentType definitions page | header | sub_sub_header etc
  async createContent(options: { format?: PageFormat, properties?: PageProps, type?: BlockType } = {}) {
    // ? User given after id as position
    // ? Return specific class instances based on content type
    const { format = {}, properties = { title: 'Default page title' }, type = 'page' } = options;
    const $content_id = uuidv4();
    if (this.block_data.collection_id)
      throw new Error(error(`The block is of collection_view_page and thus cannot contain a ${type} content`));
    else {
      await this.saveTransactions([
        [
          this.createBlock({
            $block_id: $content_id,
            type,
            properties,
            format,
          }),
          blockListAfter(this.block_data.id, ['content'], { after: '', id: $content_id }),
        ]
      ])

      const recordMap = await this.getBackLinksForBlock();

      if (type === 'page') return new Page({
        block_data: recordMap.block[$content_id].value as IPage,
        ...this.getProps()
      });
      else return new Block({
        block_data: recordMap.block[$content_id].value,
        ...this.getProps()
      });
    }
  }

  async createLinkedDBContent(collection_id: string, views: UserViewArg[] = []) {
    const $content_id = uuidv4();
    const $views = views.map((view) => ({ ...view, id: uuidv4() }));
    const view_ids = $views.map((view) => view.id);
    const current_time = Date.now();
    await this.saveTransactions([
      [
        ...createViews($views, $content_id),
        blockSet($content_id, [], {
          id: $content_id,
          version: 1,
          type: 'collection_view',
          collection_id,
          view_ids,
          parent_id: this.block_data.id,
          parent_table: 'block',
          alive: true,
          created_by_table: 'notion_user',
          created_by_id: this.user_id,
          created_time: current_time,
          last_edited_by_table: 'notion_user',
          last_edited_by_id: this.user_id,
          last_edited_time: current_time
        }),
        blockListAfter(this.block_data.id, ['content'], { after: '', id: $content_id }),
        blockSet($content_id, ['last_edited_time'], current_time)
      ]
    ]);

    try {
      const { data: { recordMap } } = await axios.post(
        'https://www.notion.so/api/v3/queryCollection',
        {
          collectionId: collection_id,
          collectionViewId: view_ids[0],
          query: {},
          loader: {
            limit: 70,
            type: 'table'
          }
        },
        this.headers
      );
      this.saveToCache(recordMap);
      return new CollectionView({
        ...this.getProps(),
        parent_id: this.block_data.id,
        block_data: recordMap.block[$content_id].value
      });
    } catch (err) {
      error(err.response.data);
      return undefined;
    }
  }

  async createFullPageDBContent(options: { views?: UserViewArg[], schema?: ([string, SchemaUnitType] | [string, SchemaUnitType, Record<string, any>])[] } = {}): Promise<CollectionViewPage> {
    if (!options.views) options.views = [{ aggregations: [['title', 'count']], name: 'Default View', type: 'table' }];
    if (!options.schema) options.schema = [['Name', 'title']];
    const views = (options.views && options.views.map((view) => ({ ...view, id: uuidv4() }))) || [];
    const view_ids = views.map((view) => view.id);
    const $collection_id = uuidv4();
    const current_time = Date.now();
    const schema: Schema = {};
    if (options.schema)
      options.schema.forEach(opt => {
        const schema_key = (opt[1] === "title" ? "Title" : opt[0]).toLowerCase().replace(/\s/g, '_');
        schema[schema_key] = { name: opt[0], type: opt[1], ...(opt[2] ?? {}) };
        if (schema[schema_key].options) schema[schema_key].options = (schema[schema_key] as any).options.map(([value, color]: [string, string]) => ({ id: uuidv4(), value, color }))
      });

    await this.saveTransactions([
      [
        blockUpdate(this.block_data.id, [], {
          id: this.block_data.id,
          type: 'collection_view_page',
          collection_id: $collection_id,
          view_ids,
          properties: {},
          created_time: current_time,
          last_edited_time: current_time
        }),
        collectionUpdate($collection_id, [], {
          id: $collection_id,
          schema,
          format: {
            collection_page_properties: []
          },
          icon: (this.block_data as IPage).format.page_icon,
          parent_id: this.block_data.id,
          parent_table: 'block',
          alive: true,
          name: (this.block_data as IPage).properties.title
        }),
        ...createViews(views, this.block_data.id),
        blockSet(this.block_data.id, ['last_edited_time'], current_time)
      ]
    ]);

    return new Promise((resolve) => {
      setTimeout(async () => {
        const { data: { recordMap, recordMap: { block: collection_view_page } } } = await axios.post(
          `https://www.notion.so/api/v3/queryCollection`,
          {
            collectionId: $collection_id,
            collectionViewId: view_ids[0],
            loader: {
              limit: 140,
              searchQuery: "",
              type: "table",
            },
            query: {}
          },
          this.headers
        ) as { data: QueryCollectionResult };
        this.saveToCache(recordMap);
        resolve(new CollectionViewPage({
          ...this.getProps(),
          // ? RF: Why would you need parent id if `collection_view_page[this.block_data.id]` already has that
          parent_id: this.block_data.id,
          block_data: collection_view_page[this.block_data.id].value as ICollectionViewPage
        }))
      }, this.interval)
    });
  }

  // ? RF:1 Transfer to CollectionBlock class 
  async getCollectionViewPage(): Promise<undefined | Collection> {
    // ? Return new CollectionViewPage passing parent block data and new block data
    if (!this.block_data.collection_id) {
      error(`The block is not a collection_view_page`);
      return undefined;
    } else {
      await this.loadPageChunk();
      const cache_data = this.cache.collection.get(this.block_data.collection_id);
      if (cache_data)
        return new Collection({
          ...this.getProps(),
          collection_data: cache_data
        });
    }
  }

  async createInlineDBContent(options: { views?: UserViewArg[] } = {}): Promise<undefined | CollectionView> {
    //? Returns collection_view and parent block
    const $collection_view_id = uuidv4();
    const $collection_id = uuidv4();
    const views = (options.views && options.views.map((view) => ({ ...view, id: uuidv4() }))) || [];
    const view_ids = views.map((view) => view.id);
    const parent_id = this.block_data.id;
    const user_id = this.user_id;
    await this.saveTransactions([
      [
        blockUpdate($collection_view_id, [], {
          id: $collection_view_id,
          type: 'collection_view',
          collection_id: $collection_id,
          view_ids,
          properties: {},
          created_time: Date.now(),
          last_edited_time: Date.now()
        }),
        // ! Needs The schema argument
        ...createViews(views, this.block_data.id),
        collectionUpdate($collection_id, [], {
          id: $collection_id,
          schema: {
            title: { name: 'Name', type: 'title' }
          },
          format: {
            collection_page_properties: []
          },
          parent_id: $collection_view_id,
          parent_table: 'block',
          alive: true
        }),
        blockUpdate($collection_view_id, [], { parent_id: parent_id, parent_table: 'block', alive: true }),
        blockListAfter(parent_id, ['content'], { after: '', id: $collection_view_id }),
        ...createOperation($collection_view_id, user_id),
        ...lastEditOperations($collection_view_id, user_id)
      ]
    ]);

    const { data: { recordMap } } = await axios.post(
      'https://www.notion.so/api/v3/queryCollection',
      {
        collectionId: $collection_id,
        collectionViewId: view_ids[0],
        query: {},
        loader: {
          limit: 70,
          type: 'table'
        }
      },
      this.headers
    );
    this.saveToCache(recordMap);
    return new CollectionView({
      ...this.getProps(),
      parent_id: this.block_data.id,
      block_data: recordMap.block[$collection_view_id].value
    });
  }
}

export default Page;