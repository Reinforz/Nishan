import { TBlock, IOperation, TBasicBlockType } from '@nishans/types';
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

	async reposition (arg: RepositionParams) {
		const data = this.getCachedData();
		await this.executeUtil([ this.addToChildArray(this.id, arg) ], [ data.id, data.parent_id ]);
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

		await this.executeUtil(ops, [ ...sync_records, data.parent_id ]);
		return block_map;
	}

	/**
   * Update a block's properties and format
   * @param args Block update format and properties options
   */
	async update (args: Partial<A>) {
		const data = this.getCachedData();

		const { format = data.format, properties = data.properties } = args as any;

		this.logger && this.logger('UPDATE', 'Block', data.id);

		await this.executeUtil(
			[
				Operation.block.update(this.id, [], {
					properties,
					format,
					...this.getLastEditedProps()
				})
			],
			data.id
		);
	}

	/**
   * Convert the current block to a different basic block
   * @param type `TBasicBlockType` basic block types
   */
	async convertTo (type: TBasicBlockType) {
		const data = this.getCachedData() as any;
		data.type = type;
		this.logger && this.logger('UPDATE', 'Block', data.id);
		await this.executeUtil([ Operation.block.update(this.id, [], { type }) ], data.id);
	}

	/**
   * Delete the current block
   */
	async delete () {
		const data = this.getCachedData();
		const is_root_page = data.parent_table === 'space' && data.type === 'page';

		await this.executeUtil(
			[
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
			],
			this.id
		);
	}

	/**
   * Transfer a block from one parent page to another page
   * @param new_parent_id Id of the new parent page
   */
	async transfer (new_parent_id: string) {
		const data = this.getCachedData();
		await this.executeUtil(
			[
				Operation.block.update(this.id, [], {
					...this.getLastEditedProps(),
					permissions: null,
					parent_id: new_parent_id,
					parent_table: 'block',
					alive: true
				}),
				Operation.block.listRemove(data.parent_id, [ 'content' ], { id: data.id }),
				Operation.block.listAfter(new_parent_id, [ 'content' ], { after: '', id: data.id }),
				Operation.block.set(data.parent_id, [], this.getLastEditedProps()),
				Operation.block.set(new_parent_id, [], this.getLastEditedProps())
			],
			[ this.id, data.parent_id, new_parent_id ]
		);
	}
}

export default Block;
