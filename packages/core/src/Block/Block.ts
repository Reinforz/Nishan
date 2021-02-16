import { Mutations } from '@nishans/endpoints';
import { Operation } from '@nishans/operations';
import { TBlock, TBasicBlockType, ISpace, IPage, ICollectionBlock, TData } from '@nishans/types';
import { TBlockInput, NishanArg, RepositionParams } from '../../types';
import { createBlockClass, createBlockMap, generateId } from '../../utils';

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

	async duplicate (infos: { id?: string }[]) {
		const block_map = createBlockMap(),
			data = this.getCachedData();
		for (let index = 0; index < infos.length; index++) {
			const { id } = infos[index],
				block_id = generateId(id);
			if (data.type === 'collection_view' || data.type === 'collection_view_page') {
				this.Operations.stack.push(
					Operation.block.update(block_id, [], {
						id: block_id,
						type: 'copy_indicator',
						parent_id: data.parent_id,
						parent_table: 'block',
						alive: true
					})
				);
				await Mutations.enqueueTask(
					{
						task: {
							eventName: 'duplicateBlock',
							request: {
								sourceBlockId: data.id,
								targetBlockId: block_id,
								addCopyName: true
							}
						}
					},
					this.getConfigs()
				);
				this.logger && this.logger('CREATE', 'block', block_id);
			} else {
				this.Operations.stack.push(
					Operation.block.update(block_id, [], {
						...data,
						id: block_id,
						copied_from: data.id
					})
				);
				this.logger && this.logger('CREATE', 'block', block_id);
			}
			const block_map_data = createBlockClass(data.type, block_id, this.getProps());
			block_map[data.type].set(block_id, block_map_data);
			if (data.type === 'page') block_map[data.type].set((data as IPage).properties.title[0][0], block_map_data);
			else if (data.type === 'collection_view' || data.type === 'collection_view_page') {
				const collection = this.cache.collection.get((data as ICollectionBlock).collection_id);
				if (collection) block_map[data.type].set(collection.name[0][0], block_map_data);
			}
		}
		// ? FEAT:1:H update local cache
		return block_map;
	}

	/**
   * Update a block's properties and format
   * @param args Block update format and properties options
   */
	// ? FIX:1:M update local cache
	update (args: Partial<A>) {
		const data = this.getCachedData() as any;
		const { format = data.format, properties = data.properties } = args as any;
		this.logger && this.logger('UPDATE', 'block', data.id);
		this.Operations.stack.push(
			Operation.block.update(this.id, [], {
				properties,
				format,
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
		this.Operations.stack.push(Operation.block.update(this.id, [], { type }));
	}

	/**
   * Delete the current block
   */
	delete () {
		const data = this.getCachedData();
		const is_root_page = data.parent_table === 'space' && data.type === 'page';
		if (is_root_page) {
			const space = this.cache.space.get(data.parent_id) as ISpace;
			space.pages = space.pages.filter((id) => id !== data.id);
			this.updateLastEditedProps(space);
		} else {
			const page = this.cache.block.get(data.parent_id) as IPage;
			page.content = page.content.filter((id) => id !== data.id);
			this.updateLastEditedProps(page);
		}
		data.alive = false;
		this.updateLastEditedProps();
		this.Operations.stack.push(
			Operation.block.update(this.id, [], {
				alive: false,
				...this.getLastEditedProps()
			}),
			is_root_page
				? Operation.space.listRemove(data.space_id, [ 'pages' ], { id: data.id })
				: Operation.block.listRemove(data.parent_id, [ 'content' ], { id: data.id }),
			is_root_page
				? Operation.space.update(data.space_id, [], this.getLastEditedProps())
				: Operation.block.update(data.parent_id, [], this.getLastEditedProps())
		);
	}

	/**
   * Transfer a block from one parent page to another page
   * @param new_parent_id Id of the new parent page
   */
	transfer (new_parent_id: string) {
		const data = this.getCachedData(),
			parent_data = this.cache.block.get(data.parent_id) as IPage,
			new_parent_data = this.cache.block.get(new_parent_id) as IPage;
		data.parent_id = new_parent_id;
		parent_data.content = parent_data.content.filter((id) => id !== data.id);
		this.updateLastEditedProps();
		this.updateLastEditedProps(parent_data);

		if (new_parent_data) {
			new_parent_data.content.push(data.id);
			this.updateLastEditedProps(new_parent_data);
		}

		this.Operations.stack.push(
			Operation.block.update(this.id, [], {
				...this.getLastEditedProps(),
				parent_id: new_parent_id,
				parent_table: 'block',
				alive: true
			}),
			Operation.block.listRemove(data.parent_id, [ 'content' ], { id: data.id }),
			Operation.block.listAfter(new_parent_id, [ 'content' ], { after: '', id: data.id }),
			Operation.block.set(data.parent_id, [], this.getLastEditedProps()),
			Operation.block.set(new_parent_id, [], this.getLastEditedProps())
		);
	}
}

export default Block;
