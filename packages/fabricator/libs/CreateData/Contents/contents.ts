import { NotionCache } from "@nishans/cache";
import { NotionEndpoints } from "@nishans/endpoints";
import { generateId } from "@nishans/idz";
import { NotionOperations } from "@nishans/operations";
import { ICollection, ICollectionBlock, ICollectionView, ICollectionViewPage, IColumn, IColumnList, IFactory, IPage, TBlock, TCollectionBlock, WebBookmarkProps } from "@nishans/types";
import { NotionUtils } from "@nishans/utils";
import { CreateData, INotionFabricatorOptions, TBlockCreateInput } from "..";
import { updateChildContainer } from "../../updateChildContainer";
import { populatePermissions, stackCacheMap } from "./utils";

/**
 * * Iterate through each of the content
  * * Populates the block map, using the id and the optional name
  * * Add the block to the cache
  * * Execute the operation
 * * If it contains nested contents, follow step 1
 * @param contents The content create input
 * @param parent_id Root parent id
 * @param parent_table Root parent table
 * @param options Props passed to the created block objects
 */
export async function contents(contents: TBlockCreateInput[], root_parent_id: string, root_parent_table: 'collection' | 'block' | 'space', options: INotionFabricatorOptions, cb?: ((data: TBlock)=>any)) {
  // Metadata used for all blocks
  const metadata = {
    created_time: Date.now(),
    created_by_id: options.user_id,
    created_by_table: 'notion_user',
    last_edited_time: Date.now(), 
    last_edited_by_table: "notion_user", 
    last_edited_by_id: options.user_id,
    space_id: options.space_id,
    shard_id: options.shard_id,
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
      } as any;
      if((content as any).properties)
        common_data.properties = (content as any).properties;
      if((content as any).format)
        common_data.format = (content as any).format;

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
        const collection_id = generateId(content.collection_id);
        // Construct the collection block object
        const data: ICollectionBlock = {
          ...common_data,
          ...metadata,
          collection_id: collection_id,
          view_ids: [],
        };
        if (content.type === "collection_view_page") (data as ICollectionViewPage).permissions = [populatePermissions(options.user_id, content.isPrivate)];
        await stackCacheMap<ICollectionViewPage>(data as any, options, cb);
        
        const [, views_data] = await CreateData.collection({...content, collection_id}, block_id, options);
        const view_ids = views_data.map(view_data=>view_data.id);
        await NotionOperations.executeOperations([NotionOperations.Chunk.block.set(block_id, ['view_ids'], view_ids) ], options);
        (options.cache.block.get(block_id) as TCollectionBlock).view_ids = view_ids;
        await traverse(content.rows, collection_id, "collection");
      } else if (content.type === "factory") {
        const factory_data: IFactory = {
          content: [],
          ...common_data,
          ...metadata
        }
        
        await stackCacheMap<IFactory>(factory_data, options, cb);
        await traverse(content.contents, block_id, "block");
      }
      else if (content.type === "linked_db") {
        const { collection_id, views } = content, view_ids: string[] = [],
          // fetch the referenced collection id
          collection = await NotionCache.fetchDataOrReturnCached<ICollection>('collection', collection_id, options),
          // Create the views separately, without creating the collection, as its only referencing one
          collection_view_data: ICollectionView = {
            ...common_data,
            ...metadata,
            view_ids,
            collection_id,
            type: 'collection_view'
          };
        await stackCacheMap<ICollectionView>(collection_view_data, options, cb);
        const views_data = await CreateData.views(collection, views, options, block_id);
        await NotionOperations.executeOperations([NotionOperations.Chunk.block.set(block_id, ['view_ids'], views_data.map(view_data=>view_data.id))], options);
        views_data.forEach(({id})=>view_ids.push(id))
      }
      else if (content.type === "page") {
        // Construct the default page object, with permissions data
        const page_data: IPage = {
          ...common_data,
          ...metadata,
          content: [],
          is_template: (content as any).is_template && parent_table === "collection",
          permissions: [populatePermissions(options.user_id, content.isPrivate)],
        }

        await stackCacheMap<IPage>(page_data, options, cb);
        await traverse(content.contents, block_id, "block");
      }
      else if (content.type === "column_list") {
        const { contents } = content, column_ids: string[] = [];
        const column_list_data: IColumnList = {
          content: column_ids,
          ...common_data,
          ...metadata
        };

        await stackCacheMap(column_list_data, options, cb);

        // For each contents create a column
        for (let index = 0; index < contents.length; index++) {
          const column_id = generateId(contents[index].id), column_data: IColumn = {
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
          
          await stackCacheMap<IColumn>(column_data, options, cb);
          await traverse(contents[index].contents, column_id, "block");
          column_ids.push(column_id);
        }
        await NotionOperations.executeOperations([
          NotionOperations.Chunk.block.set(block_id, ['content'], column_ids)
        ], options) 
      } else if (content.type.match(/^(embed|gist|abstract|invision|framer|whimsical|miro|pdf|loom|codepen|typeform|tweet|maps|figma|video|audio|image)$/)) {
        const response = (await NotionEndpoints.Queries.getGenericEmbedBlockData({
          pageWidth: 500,
          source: (content as any).properties.source[0][0] as string,
          type: content.type as any
        }, options));
        
        NotionUtils.deepMerge(common_data, response);
        
        const block_data: any = {
          ...common_data,
          ...metadata
        };

        await stackCacheMap<any>(block_data, options, cb);
      }
      // Block is a non parent type
      else if (content.type !== "link_to_page") {
        const block_data: any = {
          ...common_data,
          ...metadata
        };
        await stackCacheMap<any>(block_data, options, cb);
      }

      if (content.type === "bookmark") {
        await NotionEndpoints.Mutations.setBookmarkMetadata({
          blockId: block_id,
          url: (content.properties as WebBookmarkProps).link[0][0]
        }, options);
        await NotionCache.updateCacheManually([[block_id, "block"]], options);
      }

      // If the type is link_to_page use the referenced page_id as the content id else use the block id 
      const content_id = content.type === "link_to_page" ? content.page_id : block_id;
      
      // if the parent table is either a block, or a space, or a collection and page is a template, push to child append operation to the stack
      if(parent_table === "block" || parent_table==="space" || (parent_table === "collection" && (content as any).is_template))
        await updateChildContainer(parent_table, parent_id, true, content_id, options);

      options.logger && options.logger("CREATE","block", content_id)
    }
  }

  await traverse(contents, root_parent_id, root_parent_table);
}