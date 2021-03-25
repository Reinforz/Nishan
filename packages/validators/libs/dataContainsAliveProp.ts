import { TDataType } from '@nishans/types';
export const dataContainsAliveProp = (data_type: TDataType) =>
	Boolean(data_type.match(/^(block|space_view|collection_view|comment)$/));
