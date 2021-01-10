import { TDataType, IOperation, ICollection } from "@nishans/types";
import { TBlockCreateInput, UpdateCacheManuallyParam, ITBlock, NishanArg } from "types";
import { generateId, createViews, createBlockMap, createCollection, createBlockClass, Operation } from "../utils";
import { v4 as uuidv4 } from 'uuid';

export async function nestedContentPopulate(contents: TBlockCreateInput[], parent_id: string, parent_table: TDataType, props: Omit<NishanArg,"id">, this_id: string) {
  const ops: IOperation[] = [], sync_records: UpdateCacheManuallyParam = [], block_map = createBlockMap();

  const CollectionView = require("../api/CollectionView").default;
  const CollectionViewPage = require('../api/CollectionViewPage').default;
  const Block = require('../api/Block').default;

  const traverse = async (contents: TBlockCreateInput[], parent_id: string, parent_table: TDataType, parent_content_id?: string) => {
    parent_content_id = parent_content_id ?? parent_id;
    for (let index = 0; index < contents.length; index++) {
      const content = contents[index], $block_id = generateId(content.id);
      sync_records.push($block_id);
      content.type = content.type ?? 'page';

      /* if (content.type.match(/gist|codepen|tweet|maps|figma/)) {
        content.format = (await this.getGenericEmbedBlockData({
          pageWidth: 500,
          source: (content.properties as any).source[0][0] as string,
          type: content.type as TGenericEmbedBlockType
        })).format;
      }; */

      const {
        format,
        properties,
        type,
      } = content;

      /* if (type === "bookmark") {
        bookmarks.push({
          blockId: $block_id,
          url: (properties as WebBookmarkProps).link[0][0]
        })
        await this.setBookmarkMetadata({
          blockId: $block_id,
          url: (properties as WebBookmarkProps).link[0][0]
        });
      } */

      /* else if (type === "drive") {
        const {
          accounts
        } = await this.getGoogleDriveAccounts();
        await this.initializeGoogleDriveBlock({
          blockId: $block_id,
          fileId: (content as IDriveInput).file_id as string,
          token: accounts[0].token
        });
      } */

      if (content.type === "collection_view_page" || content.type === "collection_view") {
        const [collection_id, create_view_ops, view_ids, , view_records] = createCollection(content, $block_id, props);
        const args: any = {
          id: $block_id,
          type,
          collection_id,
          view_ids,
          properties,
          format,
          parent_id,
          parent_table,
          alive: true,
        };

        if (content.type === "collection_view_page") args.permissions = [{ type: content.isPrivate ? 'user_permission' : 'space_permission', role: 'editor', user_id: props.user_id }],
          ops.push(Operation.block.update($block_id, [], args),
            ...create_view_ops,
          )

        const collectionblock = type === "collection_view" ? new CollectionView({
          ...props,
          id: $block_id
        }) : new CollectionViewPage({
          ...props,
          id: $block_id
        });

        sync_records.push([collection_id, "collection"], ...view_records)
        block_map[type].push(collectionblock);
        if (content.rows)
          await traverse(content.rows as any, collection_id, "collection")
      } else if (content.type === "factory") {
        const factory_contents_map = createBlockMap(), content_ids: string[] = [], content_blocks_ops = (content.contents.map(content => ({
          ...content,
          $block_id: generateId(content.id)
        }))).map(content => {
          factory_contents_map[content.type].push(createBlockClass(content.type, content.$block_id, props))
          sync_records.push(content.$block_id)
          content_ids.push(content.$block_id);
          return Operation.block.update(content.$block_id, [], { ...content, parent_id: $block_id, alive: true, parent_table: "block" })
        });
        ops.push(
          Operation.block.update($block_id, [], {
            id: $block_id,
            properties,
            format,
            type,
            parent_id,
            parent_table,
            alive: true,
            content: content_ids
          }),
          ...content_blocks_ops
        );
        block_map.factory.push({
          block: new Block({
            id: $block_id,
            ...props
          }), contents: factory_contents_map
        })
      }
      else if (content.type === "linked_db") {
        const { collection_id, views } = content,
          collection = props.cache.collection.get(collection_id) as ICollection,
          [created_view_ops, view_ids, , view_records] = createViews(collection.schema, views, collection.id, $block_id, props);

        ops.push(Operation.block.set($block_id, [], {
          id: $block_id,
          version: 1,
          type: 'collection_view',
          collection_id,
          view_ids,
          parent_id,
          parent_table,
          alive: true,
        }),
          ...created_view_ops);
        sync_records.push([collection_id, "collection"], ...view_records);
        const collectionblock = new CollectionView({
          ...props,
          id: $block_id
        })

        block_map[content.type].push(collectionblock)
      }
      else if (content.type === "page") {
        if (content.contents)
          await traverse(content.contents, $block_id, "block");
        const current_time = Date.now();
        ops.push(Operation.block.update($block_id, [], {
          is_template: (content as any).is_template && parent_table === "collection",
          id: $block_id,
          properties,
          format,
          type,
          parent_id,
          parent_table,
          alive: true,
          permissions: [{ type: content.isPrivate ? 'user_permission' : 'space_permission', role: 'editor', user_id: props.user_id }],
          created_time: current_time,
          created_by_id: props.user_id,
          created_by_table: 'notion_user',
          last_edited_time: Date.now(), last_edited_by_table: "notion_user", last_edited_by: props.user_id
        }))
        block_map[type].push(createBlockClass(content.type, $block_id, props));
      }
      else if (content.type === "column_list") {
        const { contents } = content;
        ops.push(Operation.block.set($block_id, [], {
          id: $block_id,
          parent_id,
          parent_table,
          alive: true,
          version: 1,
          type: "column_list",
        }));

        for (let index = 0; index < contents.length; index++) {
          const column_id = uuidv4();
          ops.push(Operation.block.set(column_id, [], {
            id: column_id,
            parent_id: $block_id,
            parent_table: "block",
            alive: true,
            type: "column",
            version: 1,
            format: {
              column_ratio: 1 / contents.length
            }
          }), Operation.block.listAfter($block_id, ['content'], { after: '', id: column_id }));
          sync_records.push(column_id);
          await traverse([contents[index]], this_id, "block", column_id)
        }
      }
      else if (content.type !== "link_to_page") {
        ops.push(Operation.block.update($block_id, [], {
          id: $block_id,
          properties,
          format,
          type,
          parent_id,
          parent_table,
          alive: true,
        }));
        block_map[type].push(createBlockClass(content.type, $block_id, props));
      }

      const content_id = content.type === "link_to_page" ? content.page_id : $block_id;

      if (parent_table === "block")
        ops.push(Operation.block.listAfter(parent_content_id, ['content'], { after: '', id: content_id }))
      else if (parent_table === "space")
        ops.push(Operation.space.listAfter(parent_content_id, ['pages'], { after: '', id: content_id }))
      else if (parent_table === "collection" && (content as any).is_template)
        ops.push(Operation.collection.listAfter(parent_content_id, ['template_pages'], { after: '', id: content_id }))
    }
  }

  await traverse(contents, parent_id, parent_table);
  return [ops, sync_records, block_map] as [IOperation[], UpdateCacheManuallyParam, ITBlock]
}