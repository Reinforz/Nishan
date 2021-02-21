import { NotionCacheObject } from "@nishans/cache";
import { generateId } from "@nishans/idz";
import { Operation } from "@nishans/operations";
import { ICollection, ICollectionBlock, ICollectionView, ICollectionViewPage, IColumn, IColumnList, IFactory, IPage } from "@nishans/types";
import { CreateData, CreateMaps } from "../../";
import { NishanArg, TBlockCreateInput } from "../../../types";
import { appendChildToParent, populatePermissions, stackCacheMap } from "./utils";

export async function contents(contents: TBlockCreateInput[], original_parent_id: string, parent_table: 'collection' | 'block' | 'space', props: Omit<NishanArg, "id">) {
  const block_map = CreateMaps.block();

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
        const [collection_id, view_ids] = await CreateData.collection(content, block_id, props);
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
          collection = await NotionCacheObject.fetchDataOrReturnCached<ICollection>('collection', collection_id, {token: props.token, interval: 0}, props.cache),
          [view_ids] = CreateData.views(collection, views, props, block_id),
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
          const column_id = generateId(), column_data: IColumn = {
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