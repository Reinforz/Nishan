import { TBlock, IOperation, TBasicBlockType, ISpace, IPage } from '@nishans/types';
import { TBlockInput, NishanArg, RepositionParams, UpdateCacheManuallyParam } from '../types';
import { createBlockClass, createBlockMap, generateId, Operation } from '../utils';

import Data from './Data';

/**
 * A class to represent block of Notion
 * @noInheritDoc
 */
class Block<T extends TBlock, A extends TBlockInput> extends Data<T> {
	constructor (arg: NishanArg) {
		super({ ...arg, type: 'block' });
	}

	reposition (arg: RepositionParams) {
		this.stack.push(this.addToChildArray(this.id, arg));
	}

	/**
   * Duplicate the current block
   * @param infos Array of objects containing information regarding the position and id of the duplicated block
   * @returns A block map
   */

	async duplicate (infos: { position: RepositionParams; id?: string }[]) {
		const block_map = createBlockMap(),
			data = this.getCachedData(),
			ops: IOperation[] = [],
			sync_records: UpdateCacheManuallyParam = [];
		for (let index = 0; index < infos.length; index++) {
			const { position, id } = infos[index],
				$gen_block_id = generateId(id);
			sync_records.push($gen_block_id);
			if (data.type === 'collection_view' || data.type === 'collection_view_page') {
				ops.push(
					Operation.block.update($gen_block_id, [], {
						id: $gen_block_id,
						type: 'copy_indicator',
						parent_id: data.parent_id,
						parent_table: 'block',
						alive: true
					})
				);
				await this.enqueueTask({
					eventName: 'duplicateBlock',
					request: {
						sourceBlockId: data.id,
						targetBlockId: $gen_block_id,
						addCopyName: true
					}
				});
				this.logger && this.logger('CREATE', 'Block', $gen_block_id);
			} else {
				ops.push(
					Operation.block.update($gen_block_id, [], {
						...data,
						id: $gen_block_id,
						copied_from: data.id
					}),
					this.addToParentChildArray($gen_block_id, position)
				);
				this.logger && this.logger('CREATE', 'Block', $gen_block_id);
			}

			block_map[data.type].push(createBlockClass(data.type, $gen_block_id, this.getProps()));
		}
		// ? FEAT:1:H update local cache
		this.stack.push(...ops);
		return block_map;
	}

	/**
   * Update a block's properties and format
   * @param args Block update format and properties options
   */
	update (args: Partial<A>) {
		const data = this.getCachedData();
		const { format = data.format, properties = data.properties } = args as any;
		this.logger && this.logger('UPDATE', 'Block', data.id);
		this.stack.push(
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
		this.logger && this.logger('UPDATE', 'Block', data.id);
		this.stack.push(Operation.block.update(this.id, [], { type }));
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
		this.stack.push(
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

		this.stack.push(
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
