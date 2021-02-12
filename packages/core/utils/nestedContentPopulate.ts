import { ICollection, IPage, IColumnList, IColumn, ICollectionBlock, ICollectionViewPage, IFactory, ICollectionView, ISpace, TPermissionRole, IPermission, IOperation } from "@nishans/types";
import { TBlockCreateInput, NishanArg, IPageCreateInput } from "../types";
import { generateId, createViews, createBlockMap, createCollection, createBlockClass, Operation } from "../utils";
import { v4 as uuidv4 } from 'uuid';
import { ICache } from "@nishans/endpoints";

function populatePermissions(user_id: string, is_private?: boolean): IPermission{
  return { type: is_private ? 'user_permission' : 'space_permission', role: 'editor', user_id: user_id }
}

export function appendChildToParent(parent_table: "collection", parent_content_id: string, content_id: string, cache: Pick<ICache, "block" | "space" | "collection">, stack: IOperation[], is_template?: boolean):void
export function appendChildToParent(parent_table: "space" , parent_content_id: string, content_id: string, cache: Pick<ICache, "block" | "space" | "collection">, stack: IOperation[]):void
export function appendChildToParent(parent_table: "block", parent_content_id: string, content_id: string, cache: Pick<ICache, "block" | "space" | "collection">, stack: IOperation[]):void
export function appendChildToParent(parent_table: "space" | "block" | "collection", parent_content_id: string, content_id: string, cache: Pick<ICache, "block" | "space" | "collection">, stack: IOperation[], is_template?: boolean):void{
  
  switch(parent_table){
    case "block": {
      stack.push(Operation.block.listAfter(parent_content_id, ['content'], { after: '', id: content_id }))
      const parent = cache.block.get(parent_content_id) as IPage;
      if(!parent['content']) parent['content'] = [];
      parent['content'].push(content_id);
      break;
    }
    case "space": {
      stack.push(Operation.space.listAfter(parent_content_id, ['pages'], { after: '', id: content_id }))
      const parent = cache.space.get(parent_content_id) as ISpace;
      if(!parent['pages']) parent['pages'] = []
      parent['pages'].push(content_id);
      break;
    }
    case "collection": {
      if(is_template){
        stack.push(Operation.collection.listAfter(parent_content_id, ['template_pages'], { after: '', id: content_id }))
        const parent = cache.collection.get(parent_content_id) as ICollection;
        if(!parent['template_pages']) parent['template_pages'] = []
        parent['template_pages'].push(content_id)
      }
      break;
    }
  }
}

export async function nestedContentPopulate(contents: TBlockCreateInput[], original_parent_id: string, parent_table: 'collection' | 'block' | 'space', props: Omit<NishanArg, "id">) {
  const block_map = createBlockMap();

  const metadata = {
    created_time: Date.now(),
    created_by_id: props.user_id,
    created_by_table: 'notion_user',
    last_edited_time: Date.now(), 
    last_edited_by_table: "notion_user", 
    last_edited_by_id: props.user_id,
    space_id: props.space_id,
    shard_id: props.shard_id,
    version: 0
  } as const;

  const traverse = async (contents: TBlockCreateInput[], parent_id: string, parent_table: 'collection' | 'block' | 'space', parent_content_id?: string) => {
    parent_content_id = parent_content_id ?? parent_id;
    for (let index = 0; index < contents.length; index++) {
      const content = contents[index], block_id = generateId(content.id);

      /* if (content.type.match(/gist|codepen|tweet|maps|figma/)) {
        content.format = (await this.getGenericEmbedBlockData({
          pageWidth: 500,
          source: (content.properties as any).source[0][0] as string,
          type: content.type as TGenericEmbedBlockType
        })).format;
      }; */

      /* if (type === "bookmark") {
        bookmarks.push({
          blockId: block_id,
          url: (properties as WebBookmarkProps).link[0][0]
        })
        await this.setBookmarkMetadata({
          blockId: block_id,
          url: (properties as WebBookmarkProps).link[0][0]
        });
      } */

      /* else if (type === "drive") {
        const {
          accounts
        } = await this.getGoogleDriveAccounts();
        await this.initializeGoogleDriveBlock({
          blockId: block_id,
          fileId: (content as IDriveInput).file_id as string,
          token: accounts[0].token
        });
      } */

      if (content.type === "collection_view_page" || content.type === "collection_view") {
        const {type} = content;
        const CollectionView = require("../src/CollectionView").default;
        const CollectionViewPage = require('../src/CollectionViewPage').default;
        const [collection_id, view_ids] = await createCollection(content, block_id, props);
        const args: ICollectionBlock = {
          id: block_id,
          type: content.type,
          collection_id,
          view_ids,
          parent_id,
          parent_table,
          alive: true,
          ...metadata
        };

        if (content.type === "collection_view_page") (args as ICollectionViewPage).permissions = [populatePermissions(props.user_id, content.isPrivate)];

        props.stack.push(Operation.block.update(block_id, [], JSON.parse(JSON.stringify(args))))
        props.cache.block.set(block_id, JSON.parse(JSON.stringify(args)))

        const collectionblock = type === "collection_view" ? new CollectionView({
          ...props,
          id: block_id
        }) : new CollectionViewPage({
          ...props,
          id: block_id
        });

        block_map[type].set(block_id, collectionblock);
        block_map[type].set(content.name[0][0], collectionblock);
        if (content.rows)
          await traverse(content.rows, collection_id, "collection")
      } else if (content.type === "factory") {
        const Block = require('../src/Block').default;
        // ! FIX:1:H Nested content for factory children is not populated, ie if a page is passed as a children, its nested content will not be populated 
        const content_ids: string[] = [], content_blocks_ops = (content.contents.map(content => ({
          ...content,
          block_id: generateId(content.id)
        }))).map(content => {
          content_ids.push(content.block_id);
          const content_data: any = {
            ...content, parent_id: block_id, parent_table: "block", ...metadata
          };
          props.cache.block.set(content.block_id, JSON.parse(JSON.stringify(content_data)))
          return Operation.block.update(content.block_id, [], JSON.parse(JSON.stringify(content_data)))
        });
        const factory_data: IFactory = {
          id: block_id,
          properties: content.properties,
          format: content.format,
          type: content.type,
          parent_id,
          parent_table: "block",
          alive: true,
          contents: content_ids,
          ...metadata
        }
        props.stack.push(
          Operation.block.update(block_id, [], JSON.parse(JSON.stringify(factory_data))),
          ...content_blocks_ops
        );
        props.cache.block.set(block_id, JSON.parse(JSON.stringify(factory_data)))
        block_map.factory.set(block_id, new Block({
          id: block_id,
          ...props
        }))
      }
      else if (content.type === "linked_db") {
        const CollectionView = require("../src/CollectionView").default;
        const { collection_id, views } = content,
          collection = props.cache.collection.get(collection_id) as ICollection,
          [view_ids] = createViews(collection, views, props, block_id),
          collection_view_data: ICollectionView = {
            id: block_id,
            type: 'collection_view',
            collection_id,
            view_ids,
            parent_id,
            parent_table: "block",
            alive: true,
            ...metadata
          }

        props.stack.push(Operation.block.set(block_id, [], JSON.parse(JSON.stringify(collection_view_data))));
        props.cache.block.set(block_id, JSON.parse(JSON.stringify(collection_view_data)));
        block_map[content.type].set(block_id, new CollectionView({
          ...props,
          id: block_id
        }))
      }
      else if (content.type === "page") {
        const {type} = content;
        const page_data: IPage = {
          content: [],
          is_template: (content as any).is_template && parent_table === "collection",
          id: block_id,
          properties: content.properties,
          format: content.format,
          type: "page",
          parent_id,
          parent_table,
          alive: true,
          permissions: [populatePermissions(props.user_id, content.isPrivate)],
          ...metadata
        }

        props.stack.push(Operation.block.update(block_id, [], JSON.parse(JSON.stringify(page_data))));
        props.cache.block.set(block_id, JSON.parse(JSON.stringify(page_data)));
        const block_obj = createBlockClass(content.type, block_id, props)
        block_map[type].set(block_id, block_obj);
        block_map[type].set(content.properties.title[0][0], block_obj);
        if (content.contents)
          await traverse(content.contents, block_id, "block");
      }
      else if (content.type === "column_list") {
        const { contents } = content;
        const column_list_data: IColumnList = {
          id: block_id,
          parent_id,
          parent_table: "block",
          alive: true,
          type: "column_list",
          content: [],
          ...metadata
        };
        props.stack.push(Operation.block.set(block_id, [], JSON.parse(JSON.stringify(column_list_data))));
        props.cache.block.set(block_id, JSON.parse(JSON.stringify(column_list_data)))

        for (let index = 0; index < contents.length; index++) {
          const column_id = uuidv4(), column_data: IColumn = {
            id: column_id,
            parent_id: block_id,
            parent_table: "block",
            alive: true,
            type: "column",
            format: {
              column_ratio: 1 / contents.length
            },
            ...metadata,
            content: []
          };
          props.stack.push(Operation.block.set(column_id, [], JSON.parse(JSON.stringify(column_data))), Operation.block.listAfter(block_id, ['content'], { after: '', id: column_id }));
          props.cache.block.set(column_id, JSON.parse(JSON.stringify(column_data)));
          column_list_data.content.push(column_id);
          await traverse([contents[index]], original_parent_id, "block", column_id)
        }
      }
      else if (content.type !== "link_to_page") {
        const block_data: any = {
          id: block_id,
          properties: content.properties,
          format: content.format,
          type: content.type,
          parent_id,
          parent_table,
          alive: true,
          ...metadata
        };
        props.stack.push(Operation.block.update(block_id, [], JSON.parse(JSON.stringify(block_data))));
        props.cache.block.set(block_id, JSON.parse(JSON.stringify(block_data)));
        const block_obj = createBlockClass(content.type, block_id, props)
        block_map[content.type].set(block_id,block_obj);
      }

      const content_id = content.type === "link_to_page" ? content.page_id : block_id;
      appendChildToParent(parent_table as any, parent_content_id, content_id, props.cache, props.stack, (content as any).is_template);
      
      props.logger && props.logger("CREATE","block", content_id)
    }
  }

  await traverse(contents, original_parent_id, parent_table);
  return block_map;
}