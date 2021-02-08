import { TDataType, TBlock } from '@nishans/types';

type SupportedTDataType = Exclude<TDataType, 'collection_view' | 'notion_user' | 'user_settings'>;
export function detectChildData (type: 'block', data: TBlock): [string, TDataType];
export function detectChildData (type: Exclude<SupportedTDataType, 'block'>): [string, TDataType];
export function detectChildData (type: SupportedTDataType, data?: TBlock): [string, TDataType] {
	let child_type: TDataType = 'block',
		child_path = '';
	if (type === 'block') {
		if (data) {
			if (data.type === 'page') child_path = 'content';
			else if (data.type === 'collection_view' || data.type === 'collection_view_page') {
				child_path = 'view_ids';
				child_type = 'collection_view';
			} else throw new Error(`Unsupported block type ${data.type}`);
		} else throw new Error(`type block requires second data argument`);
	} else if (type === 'space') child_path = 'pages';
	else if (type === 'user_root') {
		child_path = 'space_views';
		child_type = 'space_view';
	} else if (type === 'collection') child_path = 'template_pages';
	else if (type === 'space_view') child_path = 'bookmarked_pages';
	else throw new Error(`Unsupported ${type} data provided`);

	return [ child_path, child_type ];
}
