import { NotionCache } from '@nishans/cache';
import { NotionEndpoints } from '@nishans/endpoints';
import { NotionIdz } from '@nishans/idz';
import { NotionInit } from '@nishans/init';
import { NotionLineage } from '@nishans/lineage';
import { NotionLogger } from '@nishans/logger';
import { NotionOperations } from '@nishans/operations';
import {
	ICollection,
	ICollectionBlock,
	ICollectionView,
	ICollectionViewPage,
	IColumn,
	IColumnList,
	IFactory,
	IOperation,
	IPage,
	ISpace,
	TBlock,
	WebBookmarkProps
} from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { CreateData } from '../';
import { INotionFabricatorOptions, TBlockCreateInput } from '../../';
import { executeOperationAndStoreInCache, populatePermissions } from './utils';

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
export async function contents (
	contents: TBlockCreateInput[],
	root_parent_id: string,
	root_parent_table: 'collection' | 'block' | 'space',
	options: Omit<INotionFabricatorOptions, 'cache_init_tracker'>,
	cb?: ((data: TBlock) => any)
) {
	// Metadata used for all blocks
	const metadata = NotionInit.blockMetadata({
		created_by_id: options.user_id,
		last_edited_by_id: options.user_id,
		space_id: options.space_id,
		shard_id: options.shard_id
	});

	const operations: IOperation[] = [];

	const traverse = async (
		contents: TBlockCreateInput[],
		parent_id: string,
		parent_table: 'collection' | 'block' | 'space'
	) => {
		for (let index = 0; index < contents.length; index++) {
			const content = contents[index],
				block_id = NotionIdz.Generate.id((content as any).id);
			// Common data to be used for all blocks
			const common_data = {
				id: block_id,
				parent_table,
				parent_id,
				type: content.type
			} as any;
			if ((content as any).properties) common_data.properties = (content as any).properties;
			if ((content as any).format) common_data.format = (content as any).format;

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

			if (content.type === 'collection_view_page' || content.type === 'collection_view') {
				// Construct the collection first
				const collection_id = NotionIdz.Generate.id(content.collection_id),
					view_ids: string[] = [];
				// Construct the collection block object
				const data: ICollectionBlock = {
					...common_data,
					...metadata,
					collection_id: collection_id,
					view_ids
				};
				if (content.type === 'collection_view_page')
					(data as ICollectionViewPage).permissions = [ populatePermissions(options.user_id, content.isPrivate) ];
				const [ , views_data, collection_operations ] = await CreateData.collection(
					{ ...content, collection_id },
					block_id,
					options
				);
				views_data.forEach((view_data) => view_ids.push(view_data.id));
				operations.push(
					...collection_operations,
					await executeOperationAndStoreInCache<ICollectionViewPage>(data as any, options, cb)
				);
				await traverse(content.rows, collection_id, 'collection');
			} else if (content.type === 'factory') {
				const factory_data: IFactory = {
					content: [],
					...common_data,
					...metadata
				};

				operations.push(await executeOperationAndStoreInCache<IFactory>(factory_data, options, cb));
				await traverse(content.contents, block_id, 'block');
			} else if (content.type === 'linked_db') {
				const { collection_id, views } = content,
					view_ids: string[] = [],
					// fetch the referenced collection id
					collection = (await NotionCache.fetchDataOrReturnCached('collection', collection_id, options)) as ICollection,
					// Create the views separately, without creating the collection, as its only referencing one
					collection_view_data: ICollectionView = {
						...common_data,
						...metadata,
						view_ids,
						collection_id,
						type: 'collection_view'
					};

				const [ views_data, view_operations ] = await CreateData.views(collection, views, options, block_id);
				views_data.forEach(({ id }) => view_ids.push(id));
				operations.push(
					...view_operations,
					await executeOperationAndStoreInCache<ICollectionView>(collection_view_data, options, cb)
				);
			} else if (content.type === 'page') {
				// Construct the default page object, with permissions data
				const page_data: IPage = {
					...common_data,
					...metadata,
					content: [],
					is_template: (content as any).is_template && parent_table === 'collection',
					permissions: [ populatePermissions(options.user_id, content.isPrivate) ]
				};

				operations.push(await executeOperationAndStoreInCache<IPage>(page_data, options, cb));
				await traverse(content.contents, block_id, 'block');
			} else if (content.type === 'column_list') {
				const { contents } = content,
					column_ids: string[] = [];
				const column_list_data: IColumnList = {
					content: column_ids,
					...common_data,
					...metadata
				};

				operations.push(await executeOperationAndStoreInCache(column_list_data, options, cb));

				// For each contents create a column
				for (let index = 0; index < contents.length; index++) {
					const column_id = NotionIdz.Generate.id(contents[index].id),
						column_data: IColumn = {
							id: column_id,
							parent_id: block_id,
							parent_table: 'block',
							type: 'column',
							format: {
								column_ratio: 1 / contents.length
							},
							...metadata,
							content: []
						} as any;

					operations.push(await executeOperationAndStoreInCache<IColumn>(column_data, options, cb));
					await traverse(contents[index].contents, column_id, 'block');
					column_ids.push(column_id);
				}
				operations.push(NotionOperations.Chunk.block.set(block_id, [ 'content' ], column_ids));
			} else if (
				content.type.match(
					/^(embed|gist|abstract|invision|framer|whimsical|miro|pdf|loom|codepen|typeform|tweet|maps|figma|video|audio|image)$/
				)
			) {
				const response = await NotionEndpoints.Queries.getGenericEmbedBlockData(
					{
						pageWidth: 500,
						source: (content as any).properties.source[0][0] as string,
						type: content.type as any
					},
					options
				);

				if (!response.empty) NotionUtils.deepMerge(common_data, response);

				const block_data: any = {
					...common_data,
					...metadata
				};

				operations.push(await executeOperationAndStoreInCache<any>(block_data, options, cb));
			} else if (content.type !== 'link_to_page') {
				// Block is a non parent type
				const block_data: any = {
					...common_data,
					...metadata
				};
				operations.push(await executeOperationAndStoreInCache<any>(block_data, options, cb));
			}

			if (content.type === 'bookmark') {
				await NotionOperations.executeOperations(operations, options);

				await NotionEndpoints.Mutations.setBookmarkMetadata(
					{
						blockId: block_id,
						url: (content.properties as WebBookmarkProps).link[0][0]
					},
					options
				);
				await NotionCache.updateCacheManually([ [ block_id, 'block' ] ], options);
			}

			// If the type is link_to_page use the referenced page_id as the content id else use the block id
			const content_id = content.type === 'link_to_page' ? content.page_id : block_id;

			// if the parent table is either a block, or a space, or a collection and page is a template, push to child append operation to the stack
			if (parent_table === 'block')
				operations.push(
					...(await NotionLineage.updateChildContainer<IPage>(
						parent_table,
						parent_id,
						true,
						content_id,
						'content',
						options
					))
				);
			else if (parent_table === 'space')
				operations.push(
					...(await NotionLineage.updateChildContainer<ISpace>(
						parent_table,
						parent_id,
						true,
						content_id,
						'pages',
						options
					))
				);
			else if (parent_table === 'collection' && (content as any).is_template)
				operations.push(
					...(await NotionLineage.updateChildContainer<ICollection>(
						parent_table,
						parent_id,
						true,
						content_id,
						'template_pages',
						options
					))
				);
			options.logger && NotionLogger.method.info(`CREATE block ${content_id}`);
		}
	};

	await traverse(contents, root_parent_id, root_parent_table);
	await NotionOperations.executeOperations(operations, options);
}
