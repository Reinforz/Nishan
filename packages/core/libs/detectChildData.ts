import { UnsupportedBlockTypeError, UnsupportedDataTypeError } from '@nishans/errors';
import { TBlock, TDataType } from '@nishans/types';

type SupportedTDataType = Exclude<TDataType, 'collection_view' | 'notion_user' | 'user_settings'>;

/**
 * Detect and return a tuple of child path and child data type
 * @param type The type of data
 * @param data The data itself, required only for block type data
 */
export function detectChildData (type: 'block', data: TBlock): [string, TDataType];
export function detectChildData (type: Exclude<SupportedTDataType, 'block'>): [string, TDataType];
export function detectChildData (type: SupportedTDataType, data?: TBlock): [string, TDataType] {
	let child_type: TDataType = 'block',
		child_path = '';
	if (type === 'block') {
		// If type is block, infer child data based on the data passed
		if (data) {
			if (data.type === 'page') child_path = 'content';
			else if (data.type === 'collection_view' || data.type === 'collection_view_page') {
				child_path = 'view_ids';
				child_type = 'collection_view';
			} else
				// if data.type is not a parent type, throw an error as it doesn't contain any child
				throw new UnsupportedBlockTypeError(data.type, [ 'page', 'collection_view', 'collection_view_page' ]);
			// Throw error if the data parameter was not passed, which is required when type = block
		} else throw new Error(`type block requires second data argument`);
	} else if (type === 'space') child_path = 'pages';
	else if (type === 'user_root') {
		child_path = 'space_views';
		child_type = 'space_view';
	} else if (type === 'collection') child_path = 'template_pages';
	else if (type === 'space_view') child_path = 'bookmarked_pages';
	else throw new UnsupportedDataTypeError(type, [ 'block', 'space', 'user_root', 'collection', 'space_view' ]);

	return [ child_path, child_type ];
}
