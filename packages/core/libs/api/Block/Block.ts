import { NotionCacheObject } from '@nishans/cache';
import { NotionMutations } from '@nishans/endpoints';
import { RepositionParams, TBlockInput, updateChildContainer } from '@nishans/fabricator';
import { generateId } from '@nishans/idz';
import { NotionOperationsObject, Operation } from '@nishans/operations';
import { IPage, TBasicBlockType, TBlock, TData } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { CreateMaps, NishanArg, PopulateMap } from '../../';
import Data from '../Data';

/**
 * A class to represent block of Notion
 * @noInheritDoc
 */
class Block<T extends TBlock, A extends TBlockInput> extends Data<T> {
	constructor (arg: NishanArg) {
		super({ ...arg, type: 'block' });
	}

	async getCachedParentData () {
		const data = this.getCachedData();
		return (await this.fetchDataOrReturnCached(data.parent_table, data.parent_id)) as TData;
	}

	async reposition (arg: RepositionParams) {
		await this.addToChildArray('block', await this.getCachedParentData(), arg);
	}

	/**
   * Duplicate the current block
   * @param infos Array of objects containing information regarding the position and id of the duplicated block
   * @returns A block map
   */
	async duplicate (infos: number | string[]) {
		const block_map = CreateMaps.block(),
			block = this.getCachedData();
		const ids: string[] =
			typeof infos === 'number' ? Array(infos).fill(generateId()) : infos.map((info) => generateId(info));

		for (let index = 0; index < ids.length; index++) {
			const block_id = ids[index];
			if (block.type === 'collection_view' || block.type === 'collection_view_page') {
				await NotionOperationsObject.executeOperations(
					[
						Operation.block.update(block_id, [], {
							id: block_id,
							type: 'copy_indicator',
							parent_id: block.parent_id,
							parent_table: 'block',
							alive: true
						})
					],
					this.getProps()
				);

				// ! How to save to local cache, need to poll the notion's server to see if the duplicated block has been created
				await NotionMutations.enqueueTask(
					{
						task: {
							eventName: 'duplicateBlock',
							request: {
								sourceBlockId: block.id,
								targetBlockId: block_id,
								addCopyName: true
							}
						}
					},
					this.getConfigs()
				);
			} else {
				const duplicated_block = {
					...block,
					id: block_id,
					copied_from: block.id
				};
				await NotionOperationsObject.executeOperations(
					[ Operation.block.update(block_id, [], JSON.parse(JSON.stringify(duplicated_block))) ],
					this.getProps()
				);
				this.cache.block.set(block_id, JSON.parse(JSON.stringify(duplicated_block)));
			}
			this.logger && this.logger('CREATE', 'block', block_id);
			await PopulateMap.block(block, block_map, this.getProps());
		}
		return block_map;
	}

	/**
   * Update a block's properties and format
   * @param args Block update format and properties options
   */
	async update (args: Partial<A>) {
		const data = this.getCachedData() as any;
		this.logger && this.logger('UPDATE', 'block', data.id);
		NotionUtils.deepMerge(data, args);
		await NotionOperationsObject.executeOperations(
			[
				Operation.block.update(this.id, [], {
					properties: data.properties,
					format: data.format,
					...this.updateLastEditedProps()
				})
			],
			this.getProps()
		);
	}

	/**
   * Convert the current block to a different basic block
   * @param type `TBasicBlockType` basic block types
   */
	async convertTo (type: TBasicBlockType) {
		const data = this.getCachedData() as any;
		data.type = type;
		this.logger && this.logger('UPDATE', 'block', data.id);
		await NotionOperationsObject.executeOperations(
			[
				Operation.block.update(this.id, [ 'type' ], type),
				Operation.block.update(this.id, [], this.updateLastEditedProps())
			],
			this.getProps()
		);
	}

	/**
   * Delete the current block
   */
	async delete () {
		const data = this.getCachedData(),
			parent_data = await this.getCachedParentData();

		await updateChildContainer(data.parent_table, data.parent_id, false, this.id, this.getProps());

		data.alive = false;
		this.logger && this.logger('DELETE', 'block', data.id);
		this.logger && this.logger('UPDATE', data.parent_table, parent_data.id);

		await NotionOperationsObject.executeOperations(
			[
				Operation.block.update(this.id, [], {
					alive: false,
					...this.updateLastEditedProps(data)
				}),
				Operation[data.parent_table].update(data.parent_id, [], this.updateLastEditedProps())
			],
			this.getProps()
		);
	}

	/**
   * Transfer a block from one parent page to another page
   * @param new_parent_id Id of the new parent page
   */
	async transfer (new_parent_id: string) {
		await NotionCacheObject.fetchDataOrReturnCached('block', new_parent_id, this.getConfigs(), this.cache);

		const data = this.getCachedData(),
			parent_data = (await NotionCacheObject.fetchDataOrReturnCached(
				'block',
				data.parent_id,
				this.getConfigs(),
				this.cache
			)) as IPage,
			new_parent_data = this.cache.block.get(new_parent_id) as IPage;

		data.parent_id = new_parent_id;
		parent_data.content = parent_data.content.filter((id) => id !== data.id);
		new_parent_data.content.push(data.id);

		this.logger && this.logger('UPDATE', 'block', data.id);
		this.logger && this.logger('UPDATE', 'block', parent_data.id);
		this.logger && this.logger('UPDATE', 'block', new_parent_data.id);

		await NotionOperationsObject.executeOperations(
			[
				Operation.block.update(this.id, [], {
					...this.getLastEditedProps(),
					parent_id: new_parent_id,
					parent_table: 'block',
					alive: true
				}),
				Operation.block.listRemove(parent_data.id, [ 'content' ], { id: data.id }),
				Operation.block.listAfter(new_parent_id, [ 'content' ], { after: '', id: data.id }),
				Operation.block.update(parent_data.id, [], this.updateLastEditedProps(parent_data)),
				Operation.block.update(new_parent_id, [], this.updateLastEditedProps(new_parent_data))
			],
			this.getProps()
		);
	}
}

export default Block;
