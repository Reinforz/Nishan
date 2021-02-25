import { NotionCacheObject } from "@nishans/cache";
import { generateId } from "@nishans/idz";
import { Operation } from "@nishans/operations";
import { ICollection, ICollectionBlock, ICollectionView, ICollectionViewPage, IColumn, IColumnList, IFactory, IPage } from "@nishans/types";
import { CreateData, CreateMaps } from "../../";
import { NishanArg, TBlockCreateInput } from "../../../types";
import { appendChildToParent, populatePermissions, stackCacheMap } from "./utils";

/**
 * 1. Iterate through each of the content
  * 1. Populates the block map, using the id and the optional name
  * 2. Add the block to the cache
  * 3. Add the block create operation to the stack
 * 2. If it contains nested contents, follow step 1
 * @param contents The content create input
 * @param parent_id Root parent id
 * @param parent_table Root parent table
 * @param props Props passed to the created block objects
 */
export async function contents(contents: TBlockCreateInput[], root_parent_id: string, root_parent_table: 'collection' | 'block' | 'space', props: Omit<NishanArg, "id">) {
  const block_map = CreateMaps.block();

  // Metadata used for all blocks
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
      // Common data to be used for all blocks
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
        // Construct the collection first
        const [collection_id, view_ids] = await CreateData.collection(content, block_id, props);
        // Construct the collection block object
        const data: ICollectionBlock = {
          ...common_data,
          ...metadata,
          collection_id,
          view_ids,
        };
        // If its a cvp, it can contain permissions
        if (content.type === "collection_view_page") (data as ICollectionViewPage).permissions = [populatePermissions(props.user_id, content.isPrivate)];
        stackCacheMap<ICollectionViewPage>(block_map, data as any, props, content.name[0][0]);
        // If it contain rows, iterate through all of them, by passing the collection as parent
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
          // fetch the referenced collection id
          collection = await NotionCacheObject.fetchDataOrReturnCached<ICollection>('collection', collection_id, {token: props.token, interval: 0}, props.cache),
          // Create the views separately, without creating the collection, as its only referencing one
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
        // Construct the default page object, with permissions data
        const page_data: IPage = {
          content: [],
          is_template: (content as any).is_template && parent_table === "collection",
          permissions: [populatePermissions(props.user_id, content.isPrivate)],
          ...common_data,
          ...metadata
        }

        stackCacheMap<IPage>(block_map, page_data, props, content.properties.title[0][0]);
        // Iterate through each of the contents of the page by passing the block as the parent
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

        // For each contents create a column
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
          // Push the column to the parent block
          props.stack.push(Operation.block.listAfter(block_id, ['content'], { after: '', id: column_id }));
          // Column list contains an array of column_ids
          column_list_data.content.push(column_id);
          // Traverse through each of the content by passing the column as the parent
          await traverse([contents[index]], column_id, "block")
        }
      }
      // Block is a non parent type
      else if (content.type !== "link_to_page") {
        const block_data: any = {
          ...common_data,
          ...metadata
        };
        stackCacheMap<any>(block_map, block_data, props);
      }

      // If the type is link_to_page use the referenced page_id as the content id else use the block id 
      const content_id = content.type === "link_to_page" ? content.page_id : block_id;
      
      // if the parent table is either a block, or a space, or a collection and page is a template, push to child append operation to the stack
      if(parent_table === "block" || parent_table==="space" || (parent_table === "collection" && (content as any).is_template))
        await appendChildToParent(parent_table, parent_id, content_id, props.cache, props.stack, props.token, );

      props.logger && props.logger("CREATE","block", content_id)
    }
  }

  await traverse(contents, root_parent_id, root_parent_table);
  return block_map;
}