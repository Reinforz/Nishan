import { NotionCacheObject } from "@nishans/cache";
import { NotionMutations, NotionQueries } from "@nishans/endpoints";
import { generateId } from "@nishans/idz";
import { ICollection, ICollectionBlock, ICollectionView, ICollectionViewPage, IColumn, IColumnList, IFactory, IPage, TBlock, WebBookmarkProps } from "@nishans/types";
import { CreateData, FabricatorProps, TBlockCreateInput } from "..";
import { deepMerge } from "../..";
import { updateChildContainer } from "../../updateChildContainer";
import { populatePermissions, stackCacheMap } from "./utils";

/**
 * * Iterate through each of the content
  * * Populates the block map, using the id and the optional name
  * * Add the block to the cache
  * * Add the block create operation to the stack
 * * If it contains nested contents, follow step 1
 * @param contents The content create input
 * @param parent_id Root parent id
 * @param parent_table Root parent table
 * @param props Props passed to the created block objects
 */
export async function contents(contents: TBlockCreateInput[], root_parent_id: string, root_parent_table: 'collection' | 'block' | 'space', props: FabricatorProps, cb?: ((data: TBlock)=>any)) {
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
        const [collection_data, views_data] = await CreateData.collection(content, block_id, props);
        // Construct the collection block object
        const data: ICollectionBlock = {
          ...common_data,
          ...metadata,
          collection_id: collection_data.id,
          view_ids: views_data.map(view_data=>view_data.id),
        };
        // If its a cvp, it can contain permissions
        if (content.type === "collection_view_page") (data as ICollectionViewPage).permissions = [populatePermissions(props.user_id, content.isPrivate)];
        await stackCacheMap<ICollectionViewPage>(data as any, props, cb);
        // If it contain rows, iterate through all of them, by passing the collection as parent
        await traverse(content.rows, collection_data.id, "collection")
      } else if (content.type === "factory") {
        const factory_data: IFactory = {
          content: [],
          ...common_data,
          ...metadata
        }
        
        await stackCacheMap<IFactory>(factory_data, props, cb);
        await traverse(content.contents, block_id, "block");
      }
      else if (content.type === "linked_db") {
        const { collection_id, views } = content,
          // fetch the referenced collection id
          collection = await NotionCacheObject.fetchDataOrReturnCached<ICollection>('collection', collection_id, {token: props.token, interval: 0}, props.cache),
          // Create the views separately, without creating the collection, as its only referencing one
          views_data = await CreateData.views(collection, views, props, block_id),
          collection_view_data: ICollectionView = {
            id: block_id,
            parent_id,
            parent_table: "block",
            view_ids: views_data.map(view_data=>view_data.id),
            collection_id,
            type: 'collection_view',
            ...metadata
          }

        await stackCacheMap<ICollectionView>(collection_view_data, props, cb);
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

        await stackCacheMap<IPage>(page_data, props, cb);
        await traverse(content.contents, block_id, "block");
      }
      else if (content.type === "column_list") {
        const { contents } = content;
        const column_list_data: IColumnList = {
          content: [],
          ...common_data,
          ...metadata
        };

        await stackCacheMap(column_list_data, props, cb);

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
          
          await stackCacheMap<IColumn>(column_data, props, cb);
          updateChildContainer('block', block_id, true, column_id, props)
          await traverse(contents[index], column_id, "block")
        }
      } else if (content.type.match(/^(embed|gist|abstract|invision|framer|whimsical|miro|pdf|loom|codepen|typeform|tweet|maps|figma|video|audio|image)$/)) {
        const response = (await NotionQueries.getGenericEmbedBlockData({
          pageWidth: 500,
          source: (content as any).properties.source[0][0] as string,
          type: content.type as any
        }, props));
        
        deepMerge(common_data, response);
        
        const block_data: any = {
          ...common_data,
          ...metadata
        };

        await stackCacheMap<any>(block_data, props, cb);
      }
      // Block is a non parent type
      else if (content.type !== "link_to_page") {
        const block_data: any = {
          ...common_data,
          ...metadata
        };
        await stackCacheMap<any>(block_data, props, cb);
      }

      if (content.type === "bookmark") {
        await NotionMutations.setBookmarkMetadata({
          blockId: block_id,
          url: (content.properties as WebBookmarkProps).link[0][0]
        }, {...props, interval: 0});
        await NotionCacheObject.updateCacheManually([[block_id, "block"]], {...props, interval: 0}, props.cache);
      }

      // If the type is link_to_page use the referenced page_id as the content id else use the block id 
      const content_id = content.type === "link_to_page" ? content.page_id : block_id;
      
      // if the parent table is either a block, or a space, or a collection and page is a template, push to child append operation to the stack
      if(parent_table === "block" || parent_table==="space" || (parent_table === "collection" && (content as any).is_template))
        await updateChildContainer(parent_table, parent_id, true, content_id, props);

      props.logger && props.logger("CREATE","block", content_id)
    }
  }

  await traverse(contents, root_parent_id, root_parent_table);
}