import colors from 'colors';
/**
 * Thrown when index out of bound error occurs on a parents child container
 */
export class ChildIndexOutOfBound extends Error {
	/**
   * @param child_index The index of the child id
   * @param child_container_length The length of the child container array
   * @param child_path The child path, key of the parent that contains the child container
   */
	constructor (child_index: number, child_container_length: number, child_path: string) {
		super(
			colors.bold.red(
				`Parent doesn't contain any children at index ${child_index}.\nParent child container ${child_path} contains ${child_container_length} items.`
			)
		);
	}
}
