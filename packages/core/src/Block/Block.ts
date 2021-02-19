import { Mutations } from '@nishans/endpoints';
import { Operation } from '@nishans/operations';
import { IPage, TBasicBlockType, TBlock, TData } from '@nishans/types';
import { v4 } from 'uuid';
import { NishanArg, RepositionParams, TBlockInput } from '../../types';
import { createBlockMap, deepMerge, detectChildData, fetchAndCacheData, generateId, PopulateMap } from '../../utils';
import Data from '../Data';

/**
 * A class to represent block of Notion
 * @noInheritDoc
 */
class Block<T extends TBlock, A extends TBlockInput> extends Data<T> {
	constructor (arg: NishanArg) {
		super({ ...arg, type: 'block' });
	}

	getCachedParentData (): TData {
		const data = this.getCachedData();
		return this.cache[data.parent_table].get(data.parent_id) as TData;
	}

	reposition (arg: RepositionParams) {
		this.addToChildArray('block', this.getCachedParentData(), arg);
	}

	/**
   * Duplicate the current block
   * @param infos Array of objects containing information regarding the position and id of the duplicated block
   * @returns A block map
   */
	async duplicate (infos: number | string[]) {
		const block_map = createBlockMap(),
			block = this.getCachedData();
		const ids: string[] = typeof infos === 'number' ? Array(infos).fill(v4()) : infos.map((info) => generateId(info));

		for (let index = 0; index < ids.length; index++) {
			const block_id = ids[index];
			if (block.type === 'collection_view' || block.type === 'collection_view_page') {
				this.Operations.pushToStack(
					Operation.block.update(block_id, [], {
						id: block_id,
						type: 'copy_indicator',
						parent_id: block.parent_id,
						parent_table: 'block',
						alive: true
					})
				);
				// ! How to save to local cache, needs to poll the notion's server to see if the duplicated block has been created
				await Mutations.enqueueTask(
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
				this.Operations.pushToStack(Operation.block.update(block_id, [], JSON.parse(JSON.stringify(duplicated_block))));
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
	update (args: Partial<A>) {
		const data = this.getCachedData() as any;
		this.logger && this.logger('UPDATE', 'block', data.id);
		deepMerge(data, args);

		this.Operations.pushToStack(
			Operation.block.update(this.id, [], {
				properties: data.properties,
				format: data.format,
				...this.getLastEditedProps()
			})
		);

		this.updateLastEditedProps();
	}

	/**
   * Convert the current block to a different basic block
   * @param type `TBasicBlockType` basic block types
   */
	convertTo (type: TBasicBlockType) {
		const data = this.getCachedData() as any;
		data.type = type;
		this.logger && this.logger('UPDATE', 'block', data.id);
		this.Operations.pushToStack(Operation.block.update(this.id, [], { type }));
	}

	/**
   * Delete the current block
   */
	delete () {
		const data = this.getCachedData(),
			parent_data = this.getCachedParentData();
		const [ child_path ] = detectChildData(data.parent_table as any, data as any);

		(parent_data as any)[child_path] = (parent_data as any)[child_path].filter((id: string) => id !== data.id);
		data.alive = false;
		this.updateLastEditedProps(data);
		this.updateLastEditedProps(parent_data);
		this.logger && this.logger('UPDATE', 'block', data.id);
		this.logger && this.logger('UPDATE', data.parent_table, parent_data.id);
		this.Operations.pushToStack([
			Operation.block.update(this.id, [], {
				alive: false,
				...this.getLastEditedProps()
			}),
			Operation[data.parent_table].listRemove(data.parent_id, [ child_path ], { id: data.id }),
			Operation[data.parent_table].update(data.parent_id, [], this.getLastEditedProps())
		]);
	}

	/**
   * Transfer a block from one parent page to another page
   * @param new_parent_id Id of the new parent page
   */
	async transfer (new_parent_id: string) {
		await fetchAndCacheData('block', new_parent_id, this.cache, this.token);

		const data = this.getCachedData(),
			parent_data = this.cache.block.get(data.parent_id) as IPage,
			new_parent_data = this.cache.block.get(new_parent_id) as IPage;

		this.updateLastEditedProps();
		this.updateLastEditedProps(parent_data);
		this.updateLastEditedProps(new_parent_data);

		data.parent_id = new_parent_id;
		parent_data.content = parent_data.content.filter((id) => id !== data.id);
		new_parent_data.content.push(data.id);

		this.logger && this.logger('UPDATE', 'block', data.id);
		this.logger && this.logger('UPDATE', 'block', parent_data.id);
		this.logger && this.logger('UPDATE', 'block', new_parent_data.id);

		this.Operations.pushToStack([
			Operation.block.update(this.id, [], {
				...this.getLastEditedProps(),
				parent_id: new_parent_id,
				parent_table: 'block',
				alive: true
			}),
			Operation.block.listRemove(parent_data.id, [ 'content' ], { id: data.id }),
			Operation.block.listAfter(new_parent_id, [ 'content' ], { after: '', id: data.id }),
			Operation.block.update(parent_data.id, [], this.getLastEditedProps()),
			Operation.block.update(new_parent_id, [], this.getLastEditedProps())
		]);
	}
}

export default Block;
