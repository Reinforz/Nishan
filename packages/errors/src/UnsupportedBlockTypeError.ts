import { TBlockType } from '@nishans/types';
import colors from 'colors';

/**
 * A notion specific error class, that is thrown when the block type doesn't match the supported types
 */
export class UnsupportedBlockTypeError extends Error {
	/**
   * @param given_block_type passed block type
   * @param supported_types The supported block type of the property
   */
	constructor (given_block_type: string, supported_block_types: TBlockType[]) {
		super(
			colors.bold.red(
				`Block type is not of the supported types\nGiven type: ${given_block_type}\nSupported types: ${supported_block_types.join(
					' | '
				)}`
			)
		);
	}
}
