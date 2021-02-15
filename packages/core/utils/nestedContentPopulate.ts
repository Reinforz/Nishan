import { ICollection, IPage, IColumnList, IColumn, ICollectionBlock, ICollectionViewPage, IFactory, ICollectionView, ISpace, IPermission, IOperation, TDataType, TData, TBlock } from "@nishans/types";
import { TBlockCreateInput, NishanArg, IBlockMap } from "../types";
import { generateId, createViews, createBlockMap, createCollection, createBlockClass} from "../utils";
import { v4 as uuidv4 } from 'uuid';
import { Queries } from "@nishans/endpoints";
import { ICache } from "@nishans/cache";
import { warn } from "../src";
import { Operation } from "@nishans/operations";

function populatePermissions(user_id: string, is_private?: boolean): IPermission{
  return { type: is_private ? 'user_permission' : 'space_permission', role: 'editor', user_id: user_id }
}

export async function fetchAndCacheData<D extends TData>(table: TDataType, id: string, cache: ICache, token: string){
  let data = cache[table].get(id);
  if(!data){
    warn(`${table}:${id} doesnot exist in the cache`);
    const {recordMap} = await Queries.syncRecordValues({
      requests: [
        {
          id,
          table,
          version: 0
        }
      ]
    }, {
      token,
      interval: 0
    });
    data = recordMap[table][id].value;
  }
  return data as D;
}

export async function appendChildToParent(parent_table: "space" | "block" | "collection", parent_id: string, content_id: string, cache: ICache, stack: IOperation[], token: string):Promise<void>{
  switch(parent_table){
    case "block": {
      stack.push(Operation.block.listAfter(parent_id, ['content'], { after: '', id: content_id }))
      const parent = await fetchAndCacheData<IPage>(parent_table, parent_id, cache, token);
      if(!parent['content']) parent['content'] = [];
      parent['content'].push(content_id);
      break;
    }
    case "space": {
      stack.push(Operation.space.listAfter(parent_id, ['pages'], { after: '', id: content_id }))
      const parent = await fetchAndCacheData<ISpace>(parent_table, parent_id, cache, token);
      if(!parent['pages']) parent['pages'] = []
      parent['pages'].push(content_id);
      break;
    }
    case "collection": {
      stack.push(Operation.collection.listAfter(parent_id, ['template_pages'], { after: '', id: content_id }))
      const parent = await fetchAndCacheData<ICollection>(parent_table, parent_id, cache, token);;
      if(!parent['template_pages']) parent['template_pages'] = []
      parent['template_pages'].push(content_id)
      break;
    }
  }
}

export function stackCacheMap<T extends TBlock>(block_map: IBlockMap, data: T, props: Omit<NishanArg, "id">, name?: string){
  const {id, type} = data;
  props.stack.push(Operation.block.update(id, [], JSON.parse(JSON.stringify(data))))
  props.cache.block.set(id, JSON.parse(JSON.stringify(data)))
  const block_obj = createBlockClass(type, id, props);
  block_map[type].set(id, block_obj);
  if(name)
    block_map[type].set(name, block_obj);
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
    version: 0,
    alive: true
  } as const;

  
  const traverse = async (contents: TBlockCreateInput[], parent_id: string, parent_table: 'collection' | 'block' | 'space') => {
    for (let index = 0; index < contents.length; index++) {
      const content = contents[index], block_id = generateId((content as any).id);

      const common_data = {
        id: block_id,
        parent_table,
        parent_id,
        type: content.type,
        properties: (content as any).properties,
        format: (content as any).format,
      } as any;
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
        const [collection_id, view_ids] = await createCollection(content, block_id, props);
        const data: ICollectionBlock = {
          ...common_data,
          collection_id,
          view_ids,
          ...metadata
        };

        if (content.type === "collection_view_page") (data as ICollectionViewPage).permissions = [populatePermissions(props.user_id, content.isPrivate)];
        stackCacheMap<ICollectionViewPage>(block_map, data as any, props, content.name[0][0]);
        if (content.rows)
          await traverse(content.rows, collection_id, "collection")
      } else if (content.type === "factory") {
        const factory_data: IFactory = {
          content: [],
          ...common_data,
          ...metadata
        }
        
        stackCacheMap<IFactory>(block_map, factory_data, props, content.properties.title[0][0]);
        if (content.contents)
          await traverse(content.contents, block_id, "block");
      }
      else if (content.type === "linked_db") {
        const { collection_id, views } = content,
          collection = await fetchAndCacheData<ICollection>('collection', collection_id, props.cache, props.token),
          [view_ids] = createViews(collection, views, props, block_id),
          collection_view_data: ICollectionView = {
            id: block_id,
            parent_id,
            parent_table: "block",
            view_ids,
            collection_id,
            type: 'collection_view',
            ...metadata
          }

        stackCacheMap<ICollectionView>(block_map, collection_view_data, props, collection.name[0][0]);
      }
      else if (content.type === "page") {
        const page_data: IPage = {
          content: [],
          is_template: (content as any).is_template && parent_table === "collection",
          permissions: [populatePermissions(props.user_id, content.isPrivate)],
          ...common_data,
          ...metadata
        }

        stackCacheMap<IPage>(block_map, page_data, props, content.properties.title[0][0]);
        if (content.contents)
          await traverse(content.contents, block_id, "block");
      }
      else if (content.type === "column_list") {
        const { contents } = content;
        const column_list_data: IColumnList = {
          content: [],
          ...common_data,
          ...metadata
        };

        stackCacheMap(block_map, column_list_data, props);

        for (let index = 0; index < contents.length; index++) {
          const column_id = uuidv4(), column_data: IColumn = {
            id: column_id,
            parent_id: block_id,
            parent_table: "block",
            type: "column",
            format: {
              column_ratio: 1 / contents.length
            },
            ...metadata,
            content: []
          };

          stackCacheMap<IColumn>(block_map, column_data, props);
          props.stack.push(Operation.block.listAfter(block_id, ['content'], { after: '', id: column_id }));
          column_list_data.content.push(column_id);
          await traverse([contents[index]], column_id, "block")
        }
      }
      else if (content.type !== "link_to_page") {
        const block_data: any = {
          ...common_data,
          ...metadata
        };
        stackCacheMap<any>(block_map, block_data, props);
      }

      const content_id = content.type === "link_to_page" ? content.page_id : block_id;
      
      if(parent_table === "collection" && (content as any).is_template)
        await appendChildToParent(parent_table, parent_id, content_id, props.cache, props.stack, props.token, );
      else if(parent_table === "block" || parent_table==="space")
        await appendChildToParent(parent_table, parent_id, content_id, props.cache, props.stack, props.token, );

      props.logger && props.logger("CREATE","block", content_id)
    }
  }

  await traverse(contents, original_parent_id, parent_table);
  return block_map;
}