import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

import Block from './Block';
import CollectionViewPage from './CollectionViewPage';
import CollectionView from './CollectionView';
import Collection from './Collection';

import createViews from "../utils/createViews";

import { collectionUpdate, lastEditOperations, createOperation, blockUpdate, blockSet, blockListAfter } from '../utils/chunk';

import { error, warn } from "../utils/logs";

import { Cache, QueryCollectionResult, Page as IPage, PageFormat, PageProps, Schema, SchemaUnitType, UserViewArg, CollectionViewPage as ICollectionViewPage } from "../types";

class Page extends Block {
  constructor({ cache, token, interval, user_id, shard_id, space_id, block_data }: {
    token: string,
    interval: number,
    user_id: string,
    shard_id: number,
    space_id: string,
    block_data: IPage,
    cache: Cache
  }) {
    super({ token, interval, user_id, shard_id, space_id, block_data, cache, });
    if (block_data.type !== 'page') throw new Error(error(`Cannot create page block from ${block_data.type} block`));
  }

  async update(format: Partial<PageFormat> = {}) {
    await axios.post('https://www.notion.so/api/v3/saveTransactions', this.createTransaction([[
      blockUpdate(this.block_data.id, ['format'], format),
      blockSet(this.block_data.id, ['last_edited_time'], Date.now())
    ]]), this.headers);
  }

  /**
   * Create contents for a page except **linked Database** and **Collection view** block
   * @param {ContentOptions} options Options for modifying the content during creation
   */
  // ? TD: ContentType definitions page | header | sub_sub_header etc
  async createContent(options: { format?: PageFormat, properties?: PageProps, type?: 'page' } = {}) {
    // ? User given after id as position
    // ? Return specific class instances based on content type
    const { format = {}, properties = { title: 'Default page title' }, type = 'page' } = options;
    const $content_id = uuidv4();
    const current_time = Date.now();
    if (this.block_data.collection_id)
      error(`The block is of collection_view_page and thus cannot contain a ${type} content`);
    else {
      try {
        return new Promise((resolve) =>
          setTimeout(async () => {
            await axios.post(
              'https://www.notion.so/api/v3/saveTransactions',
              this.createTransaction([
                [
                  blockUpdate($content_id, [], {
                    id: $content_id,
                    type,
                    properties,
                    format,
                    created_time: current_time,
                    last_edited_time: current_time
                  }),
                  blockUpdate($content_id, [], {
                    parent_id: this.block_data.id,
                    parent_table: 'block',
                    alive: true
                  }),
                  blockListAfter(this.block_data.id, ['content'], { after: '', id: $content_id }),
                  ...createOperation($content_id, this.user_id),
                  ...lastEditOperations($content_id, this.user_id)
                ]
              ]),
              this.headers
            );
            const res = await axios.post(
              'https://www.notion.so/api/v3/getBacklinksForBlock',
              {
                blockId: $content_id
              },
              this.headers
            );
            if (type === 'page') resolve(new Page(res.data.recordMap.block[$content_id].value));
            else resolve(new Block(res.data.recordMap.block[$content_id].value));
          }, this.interval)
        );
      } catch (err) {
        error(err.response.data);
      }
    }
  }

  async createLinkedDBContent(collection_id: string, views: UserViewArg[] = []) {
    const $content_id = uuidv4();
    const $views = views.map((view) => ({ ...view, id: uuidv4() }));
    const view_ids = $views.map((view) => view.id);
    const current_time = Date.now();
    try {
      await axios.post(
        'https://www.notion.so/api/v3/saveTransactions',
        this.createTransaction([
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
        ]),
        this.headers
      );
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
          cache: this.cache,
          token: this.token,
          interval: this.interval,
          user_id: this.user_id,
          shard_id: this.shard_id,
          space_id: this.space_id,
          parent_id: this.block_data.id,
          block_data: recordMap.block[$content_id].value
        });
      } catch (err) {
        error(err.response.data);
        return undefined;
      }
    } catch (err) {
      error(err.response.data);
      return undefined;
    }
  }

  async convertToCollectionViewPage(options: { views?: UserViewArg[], schema?: [string, SchemaUnitType, Record<string, any>][] } = {}): Promise<CollectionViewPage> {
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

    await axios.post(
      'https://www.notion.so/api/v3/saveTransactions',
      this.createTransaction([
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
      ]),
      this.headers
    );

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
          cache: this.cache,
          token: this.token,
          interval: this.interval,
          user_id: this.user_id,
          shard_id: this.shard_id,
          space_id: this.space_id,
          // ? RF: Why would you need parent id if `collection_view_page[this.block_data.id]` already has that
          parent_id: this.block_data.id,
          block_data: collection_view_page[this.block_data.id].value as ICollectionViewPage
        }))
      }, this.interval)
    });
  }

  // ? RF: Transfer to CollectionBlock class 
  async getCollectionViewPage(): Promise<undefined | Collection> {
    // ? Return new CollectionViewPage passing parent block data and new block data
    if (!this.block_data.collection_id) {
      error(`The block is not a collection_view_page`);
      return undefined;
    } else {
      await this.loadUserChunk();
      const cache_data = this.cache.collection.get(this.block_data.collection_id);
      if (cache_data)
        return new Collection({
          token: this.token,
          interval: this.interval,
          user_id: this.user_id,
          shard_id: this.shard_id,
          space_id: this.space_id,
          collection_data: cache_data
        });
    }
  }

  async createCollectionViewContent(options: { views?: UserViewArg[] } = {}): Promise<undefined | CollectionView> {
    //? Returns collection_view and parent block
    const $collection_view_id = uuidv4();
    const $collection_id = uuidv4();
    const views = (options.views && options.views.map((view) => ({ ...view, id: uuidv4() }))) || [];
    const view_ids = views.map((view) => view.id);
    const parent_id = this.block_data.id;
    const user_id = this.user_id;
    try {
      await axios.post(
        'https://www.notion.so/api/v3/saveTransactions',
        this.createTransaction([
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
        ]),
        this.headers
      );

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
        cache: this.cache,
        token: this.token,
        interval: this.interval,
        user_id: this.user_id,
        shard_id: this.shard_id,
        space_id: this.space_id,
        parent_id: this.block_data.id,
        block_data: recordMap.block[$collection_view_id].value
      });
    } catch (err) {
      error(err.response.data);
    }
  }
}

export default Page;