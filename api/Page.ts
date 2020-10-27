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
  warn
} from "../utils/logs";

import {
  Schema,
  SchemaUnitType,
  NishanArg,
  ExportType,
  Permission,
  TPermissionRole,
  Operation,
  Predicate,
  TGenericEmbedBlockType,
  TBlockType,
} from "../types/types";
import {
  BlockRepostionArg,
  CreateBlockArg,
  UserViewArg
} from "../types/function";
import {
  ISpaceView,
  SetBookmarkMetadataParams
} from "../types/api";
import {
  PageFormat,
  PageProps,
  IRootPage,
  IFactoryInput,
  TBlockInput,
  WebBookmarkProps,
  IPage,
  ICollectionView,
  ICollectionViewPage,
  TBlock,
  IPageInput,
  IHeader,
  IHeaderInput,
  IDriveInput,
  IDrive,
  IText,
  ITextInput,
  ITodo,
  ITodoInput,
  ISubHeader,
  ISubHeaderInput,
  IBulletedList,
  IBulletedListInput,
  INumberedList,
  IToggle,
  ICallout,
  ICalloutInput,
  IDivider,
  IDividerInput,
  INumberedListInput,
  IQuote,
  IQuoteInput,
  IToggleInput,
  ITOC,
  ITOCInput,
  IBreadcrumb,
  IBreadcrumbInput,
  IEquation,
  IEquationInput,
  IFactory,
  IAudio,
  IAudioInput,
  ICode,
  ICodeInput,
  IFile,
  IFileInput,
  IImage,
  IImageInput,
  IVideo,
  IVideoInput,
  IWebBookmark,
  IWebBookmarkInput,
  ICodepen,
  ICodepenInput,
  IFigma,
  IFigmaInput,
  IGist,
  IGistInput,
  IMaps,
  IMapsInput,
  ITweet,
  ITweetInput
} from "../types/block";

class Page extends Block<IPage | IRootPage, IPageInput> {
  constructor(arg: NishanArg<IPage | IRootPage>) {
    super(arg);
  }

  async getBlocks() {
    if (this.data) {
      const {
        block
      } = await this.loadPageChunk({
        chunkNumber: 0,
        cursor: {
          stack: []
        },
        limit: 50,
        pageId: this.data.id,
        verticalColumns: false
      });

      const blocks: Block<TBlock, TBlockInput>[] = [];
      if (this.data.content) {
        this.data.content.forEach(content_id => {
          const block_data = block[content_id].value;
          if (block_data) blocks.push(this.createClass(block_data.type, block_data))
        })
        return blocks;
      } else
        throw new Error(error("This page doesnot have any content"));
    } else
      throw new Error(error("Data has been deleted"))
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
   * Delete block from a page based on an id or a predicate filter 
   * @param arg id string or a predicate acting as a filter
   */
  async deleteBlock(arg: string | Predicate<TBlock>) {
    if (this.data) {
      const current_time = Date.now();
      if (typeof arg === "string") {
        if (this.data.content?.includes(arg)) {
          const block = this.cache.block.get(arg);
          if (!block)
            throw new Error(error(`No block with the id ${arg} exists`))
          else {
            await this.saveTransactions(
              [
                blockUpdate(arg, [], {
                  alive: false
                }),
                this.listRemoveOp(['content'], {
                  id: arg
                }),
                this.setOp(['last_edited_time'], current_time),
                blockSet(arg, ['last_edited_time'], current_time)
              ]
            );
            this.cache.block.delete(arg);
          }
        } else
          throw new Error(error(`This page is not the parent of the block with id ${arg}`))
      } else if (typeof arg === "function") {
        let target_block = null,
          index = 0;
        for (let [, value] of this.cache.block) {
          if (value.parent_id === this.data.id) {
            const is_target_block = await arg(value, index);
            if (is_target_block) {
              target_block = value;
              break;
            }
          }
          index++;
        }
        if (!target_block)
          throw new Error(error(`No block matched`))
        else {
          await this.saveTransactions(
            [
              blockUpdate(target_block.id, [], {
                alive: false
              }),
              this.listRemoveOp(['content'], {
                id: target_block.id
              }),
              this.setOp(['last_edited_time'], current_time),
              blockSet(target_block.id, ['last_edited_time'], current_time)
            ]
          );
          this.cache.block.delete(target_block.id);
        }
      }
    } else
      throw new Error(error("Data has been deleted"))
  }

  /**
   * Delete block from a page based on an id or a predicate filter 
   * @param arg array of ids or a predicate acting as a filter
   */
  async deleteBlocks(arg: string[] | Predicate<TBlock>) {
    if (this.data) {
      if (Array.isArray(arg)) {
        const operations: Operation[] = [];
        arg.forEach(id => {
          const current_time = Date.now();
          if (this.data && this.data.content?.includes(id)) {
            const block = this.cache.block.get(id);
            if (!block)
              throw new Error(error(`No block with the id ${arg} exists`))
            else {
              operations.push(blockUpdate(id, [], {
                alive: false
              }),
                this.listRemoveOp(['content'], {
                  id
                }),
                this.setOp(['last_edited_time'], current_time),
                blockSet(id, ['last_edited_time'], current_time))
              this.cache.block.delete(id);
            }
          } else
            throw new Error(error(`This page is not the parent of the block with id ${id}`))
        });

        await this.saveTransactions(operations);

      } else if (typeof arg === "function") {
        const target_blocks: TBlock[] = [],
          operations: Operation[] = [];
        let index = 0;

        for (let [, value] of this.cache.block) {
          if (value.parent_id === this.data.id) {
            const is_target_block = await arg(value, index);
            if (is_target_block)
              target_blocks.push(value);
          }
          index++;
        }

        target_blocks.forEach(target_block => {
          const current_time = Date.now();
          if (!target_block)
            throw new Error(error(`No block matched`))
          else if (this.data) operations.push(blockUpdate(target_block.id, [], {
            alive: false
          }),
            this.listRemoveOp(['content'], {
              id: target_block.id
            }),
            this.setOp(['last_edited_time'], current_time),
            blockSet(target_block.id, ['last_edited_time'], current_time));
          this.cache.block.delete(target_block.id);
        });
        if (operations.length === 0)
          warn("No block matched criteria")
        else
          await this.saveTransactions(operations);
      }
    } else
      throw new Error(error('Data has been deleted'))
  }

  /**
   * Update the properties and the format of the page
   * @param opts The format and properties of the page to update
   */
  async updatePage(opts: {
    format: Partial<PageFormat>,
    properties: Partial<PageProps>,
    permissions: Permission[]
  }) {
    if (this.data) {
      const {
        format = this.data.format, properties = this.data.properties, permissions = (this.data as IRootPage).permissions
      } = opts;
      await this.saveTransactions([
        this.updateOp(['format'], format),
        this.updateOp(['properties'], properties),
        this.updateOp(['permissions'], permissions),
        this.setOp(['last_edited_time'], Date.now())
      ])
    } else
      throw new Error(error('Data has been deleted'))
  }

  /**
   * Add/remove this page from the favourite list
   */
  async toggleFavourite() {
    await this.loadUserContent();
    if (this.data) {
      let target_space_view: ISpaceView | null = null;
      for (let [, space_view] of this.cache.space_view) {
        if (space_view.space_id === this.data.space_id) {
          target_space_view = space_view;
          break;
        }
      };
      if (target_space_view) {
        const is_bookmarked = target_space_view.bookmarked_pages && target_space_view.bookmarked_pages.includes(this.data.id);
        await this.saveTransactions([
          (is_bookmarked ? spaceViewListRemove : spaceViewListBefore)(target_space_view.id, ["bookmarked_pages"], {
            id: this.data.id
          })
        ])
      }
    } else
      throw new Error(error('Data has been deleted'))
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
    if (this.data) {
      const {
        dir = "output", timeZone, recursive = true, exportType = "markdown"
      } = arg || {};
      const {
        taskId
      } = await this.enqueueTask({
        eventName: 'exportBlock',
        request: {
          blockId: this.data.id,
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
    } else
      throw new Error(error('Data has been deleted'))
  }

  async createDriveContent(fileId: string, position?: number | BlockRepostionArg) {
    if (this.data) {
      const {
        accounts
      } = await this.getGoogleDriveAccounts();
      const block = await this.createContent({
        type: "drive"
      });
      if (block.data) {
        const {
          recordMap
        } = await this.initializeGoogleDriveBlock({
          blockId: block.data.id,
          fileId,
          token: accounts[0].token
        });
        const data = recordMap.block[block.data.id].value;
        return new Block({
          type: "block",
          data,
          ...this.getProps()
        });
      }
    } else
      throw new Error(error('Data has been deleted'))
  }

  async createTemplateContent(factory: IFactoryInput, position?: number | BlockRepostionArg) {

    if (this.data) {
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
      const [block_list_op, update] = this.addToChildArray($block_id, position);
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

      const recordMap = await this.loadPageChunk({
        chunkNumber: 0,
        cursor: {
          stack: []
        },
        limit: 100,
        pageId: this.data.id,
        verticalColumns: false
      });

      update();

      const data = recordMap.block[$block_id].value;
      return {
        template: new Block({
          type: "block",
          data,
          ...this.getProps()
        }),
        contents: content_block_ids.map(content_block_id => new Block({
          type: "block",

          data: recordMap.block[content_block_id].value,
          ...this.getProps()
        }))
      }
    } else
      throw new Error(error('Data has been deleted'))
  }

  /**
   * Batch add multiple contents
   * @param contents Contents options
   */

  async createContents(contents: (TBlockInput & {
    position?: number | BlockRepostionArg
  })[]) {

    if (this.data) {
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
        pageId: this.data.id,
        verticalColumns: false
      });

      const blocks: Block<TBlock, TBlockInput>[] = [];

      $block_ids.forEach($block_id => {
        const block = recordMap.block[$block_id].value;
        if (block.type === "page") blocks.push(new Page({
          type: "block",

          data: block as IPage,
          ...this.getProps()
        }));

        else if (block.type === "collection_view") blocks.push(new CollectionView({
          type: "collection_view",

          data: block,
          ...this.getProps(),
        }));

        else blocks.push(this.createClass(block.type, recordMap.block[$block_id].value));

      });

      if (!this.data.content) this.data.content = $block_ids;
      else
        this.data.content.push(...$block_ids);

      const cached_data = this.cache.block.get(this.data.id) as IPage;
      cached_data?.content?.push(...$block_ids);

      return blocks;
    } else
      throw new Error(error('Data has been deleted'))
  }

  /**
   * Create contents for a page except **linked Database** and **Collection view** block
   * @param {ContentOptions} options Options for modifying the content during creation
   */
  async createContent(options: TBlockInput & {
    file_id?: string,
    position?: number | BlockRepostionArg
  }) {
    if (this.data) {
      const $block_id = uuidv4();
      if (!this.data.content) this.data.content = []

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

      const recordMap = await this.loadPageChunk({
        chunkNumber: 0,
        cursor: {
          stack: []
        },
        limit: 100,
        pageId: this.data.id,
        verticalColumns: false
      });

      update();

      return this.createClass(type, recordMap.block[$block_id].value);
    } else
      throw new Error(error('Data has been deleted'))
  }

  async createLinkedDBContent(collection_id: string, views: UserViewArg[] = [], position?: number | BlockRepostionArg) {
    if (this.data) {
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
            parent_id: this.data.id,
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

      const {
        recordMap
      } = await this.queryCollection({
        collectionId: collection_id,
        collectionViewId: view_ids[0],
        query: {},
        loader: {
          limit: 100,
          searchQuery: '',
          type: 'table'
        }
      });
      update();
      const data = recordMap.block[$content_id].value as ICollectionView;
      return new CollectionView({
        type: "collection_view",

        ...this.getProps(),
        data
      });
    } else
      throw new Error(error('Data has been deleted'))
  }

  async createFullPageDBContent(options: {
    views?: UserViewArg[],
    schema?: ([string, SchemaUnitType] | [string, SchemaUnitType, Record<string, any>])[]
  } = {}) {
    if (this.data) {
      if (!options.views) options.views = [{
        aggregations: [
          ['title', 'count']
        ],
        name: 'Default View',
        type: 'table'
      }];
      if (!options.schema) options.schema = [
        ['Name', 'title']
      ];
      const views = (options.views && options.views.map((view) => ({
        ...view,
        id: uuidv4()
      }))) || [];
      const view_ids = views.map((view) => view.id);
      const $collection_id = uuidv4();
      const current_time = Date.now();
      const schema: Schema = {};
      if (options.schema)
        options.schema.forEach(opt => {
          const schema_key = (opt[1] === "title" ? "Title" : opt[0]).toLowerCase().replace(/\s/g, '_');
          schema[schema_key] = {
            name: opt[0],
            type: opt[1],
            ...(opt[2] ?? {})
          };
          if (schema[schema_key].options) schema[schema_key].options = (schema[schema_key] as any).options.map(([value, color]: [string, string]) => ({
            id: uuidv4(),
            value,
            color
          }))
        });

      await this.saveTransactions(
        [
          this.updateOp([], {
            id: this.data.id,
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
            icon: (this.data as IPage).format.page_icon,
            parent_id: this.data.id,
            parent_table: 'block',
            alive: true,
            name: (this.data as IPage).properties.title
          }),
          ...createViews(views, this.data.id)
        ]
      );

      const {
        recordMap
      } = await this.queryCollection({
        collectionId: $collection_id,
        collectionViewId: view_ids[0],
        query: {},
        loader: {
          limit: 100,
          searchQuery: '',
          type: 'table'
        }
      });
      const data = recordMap.block[this.data.id].value as ICollectionViewPage;
      return new CollectionViewPage({
        type: "block",
        ...this.getProps(),
        data
      })
    } else
      throw new Error(error('Data has been deleted'))
  }

  async createInlineDBContent(options: {
    views?: UserViewArg[]
  } = {}, position?: number | BlockRepostionArg) {
    // ? FEAT:1:M Task in schema

    if (this.data) {
      const $collection_view_id = uuidv4();
      const $collection_id = uuidv4();
      const views = (options.views && options.views.map((view) => ({
        ...view,
        id: uuidv4()
      }))) || [];
      const view_ids = views.map((view) => view.id);
      const [block_list_op, update] = this.addToChildArray($collection_view_id, position);
      await this.saveTransactions(
        [
          this.createBlock({
            $block_id: $collection_view_id,
            properties: {},
            format: {},
            type: 'collection_view'
          }),
          ...createViews(views, this.data.id),
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

      const {
        recordMap
      } = await this.queryCollection({
        collectionId: $collection_id,
        collectionViewId: view_ids[0],
        query: {},
        loader: {
          limit: 100,
          searchQuery: '',
          type: 'table'
        }
      });
      const data = recordMap.block[$collection_view_id].value as ICollectionView;
      update();

      return new CollectionView({
        type: "collection_view",
        ...this.getProps(),
        data
      })
    } else
      throw new Error(error('Data has been deleted'))
  }

  /**
   * Share page to users
   * @param args array of userid and role of user to share pages to
   */
  async addUsers(args: [string, TPermissionRole][]) {
    if (this.data) {
      const permissionItems: Permission[] = [];
      for (let i = 0; i < args.length; i++) {
        const [email, permission] = args[i];
        const notion_user = await this.findUser(email);
        if (!notion_user) throw new Error(error(`User does not have a notion account`));
        else
          permissionItems.push({
            role: permission,
            type: "user_permission",
            user_id: notion_user.id
          });
      }
      await this.inviteGuestsToSpace({
        blockId: this.data.id,
        permissionItems,
        spaceId: this.space_id
      })
    } else
      throw new Error(error('Data has been deleted'))
  }

  createClass(type: TBlockType, value: TBlock) {
    switch (type) {
      case "video":
        return new Block<IVideo, IVideoInput>({
          data: value as IVideo,
          ...this.getProps(),
          type: "block"
        });
      case "audio":
        return new Block<IAudio, IAudioInput>({
          data: value as IAudio,
          ...this.getProps(),
          type: "block"
        });
      case "image":
        return new Block<IImage, IImageInput>({
          data: value as IImage,
          ...this.getProps(),
          type: "block"
        });
      case "bookmark":
        return new Block<IWebBookmark, IWebBookmarkInput>({
          data: value as IWebBookmark,
          ...this.getProps(),
          type: "block"
        });
      case "code":
        return new Block<ICode, ICodeInput>({
          data: value as ICode,
          ...this.getProps(),
          type: "block"
        });
      case "file":
        return new Block<IFile, IFileInput>({
          data: value as IFile,
          ...this.getProps(),
          type: "block"
        });

      case "tweet":
        return new Block<ITweet, ITweetInput>({
          data: value as ITweet,
          ...this.getProps(),
          type: "block"
        });
      case "gist":
        return new Block<IGist, IGistInput>({
          data: value as IGist,
          ...this.getProps(),
          type: "block"
        });
      case "codepen":
        return new Block<ICodepen, ICodepenInput>({
          data: value as ICodepen,
          ...this.getProps(),
          type: "block"
        });
      case "maps":
        return new Block<IMaps, IMapsInput>({
          data: value as IMaps,
          ...this.getProps(),
          type: "block"
        });
      case "figma":
        return new Block<IFigma, IFigmaInput>({
          data: value as IFigma,
          ...this.getProps(),
          type: "block"
        });
      case "drive":
        return new Block<IDrive, IDriveInput>({
          data: value as IDrive,
          ...this.getProps(),
          type: "block"
        });

      case "text":
        return new Block<IText, ITextInput>({
          data: value as IText,
          ...this.getProps(),
          type: "block"
        });
      case "table_of_contents":
        return new Block<ITOC, ITOCInput>({
          data: value as ITOC,
          ...this.getProps(),
          type: "block"
        });
      case "equation":
        return new Block<IEquation, IEquationInput>({
          data: value as IEquation,
          ...this.getProps(),
          type: "block"
        });
      case "breadcrumb":
        return new Block<IBreadcrumb, IBreadcrumbInput>({
          data: value as IBreadcrumb,
          ...this.getProps(),
          type: "block"
        });
      case "factory":
        return new Block<IFactory, IFactoryInput>({
          data: value as IFactory,
          ...this.getProps(),
          type: "block"
        });
      case "page":
        return new Page({
          data: value as IPage,
          ...this.getProps(),
          type: "block"
        });
      case "text":
        return new Block<IText, ITextInput>({
          data: value as IText,
          ...this.getProps(),
          type: "block"
        });
      case "to_do":
        return new Block<ITodo, ITodoInput>({
          data: value as ITodo,
          ...this.getProps(),
          type: "block"
        });
      case "header":
        return new Block<IHeader, IHeaderInput>({
          data: value as IHeader,
          ...this.getProps(),
          type: "block"
        });
      case "sub_header":
        return new Block<ISubHeader, ISubHeaderInput>({
          data: value as ISubHeader,
          ...this.getProps(),
          type: "block"
        });
      case "sub_sub_header":
        return new Block<ISubHeader, ISubHeaderInput>({
          data: value as ISubHeader,
          ...this.getProps(),
          type: "block"
        });
      case "bulleted_list":
        return new Block<IBulletedList, IBulletedListInput>({
          data: value as IBulletedList,
          ...this.getProps(),
          type: "block"
        });
      case "numbered_list":
        return new Block<INumberedList, INumberedListInput>({
          data: value as INumberedList,
          ...this.getProps(),
          type: "block"
        });
      case "toggle":
        return new Block<IToggle, IToggleInput>({
          data: value as IToggle,
          ...this.getProps(),
          type: "block"
        });
      case "quote":
        return new Block<IQuote, IQuoteInput>({
          data: value as IQuote,
          ...this.getProps(),
          type: "block"
        });
      case "divider":
        return new Block<IDivider, IDividerInput>({
          data: value as IDivider,
          ...this.getProps(),
          type: "block"
        });
      case "callout":
        return new Block<ICallout, ICalloutInput>({
          data: value as ICallout,
          ...this.getProps(),
          type: "block"
        });
      case "toggle":
        return new Block<IToggle, IToggleInput>({
          data: value as IToggle,
          ...this.getProps(),
          type: "block"
        });
      case "sub_sub_header":
        return new Block<ISubHeader, ISubHeaderInput>({
          data: value as ISubHeader,
          ...this.getProps(),
          type: "block"
        });
      case "drive":
        return new Block<IDrive, IDriveInput>({
          data: value as IDrive,
          ...this.getProps(),
          type: "block"
        });
      default:
        return new Page({
          data: value as IPage,
          ...this.getProps(),
          type: "block"
        });
    }
  }
}

export default Page;