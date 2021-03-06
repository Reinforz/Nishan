import { NotionConstants } from '@nishans/constants';
import { ICollection, INotionUser, ISpace, ISpaceView, IUserRoot, IUserSettings, TBlock, TView } from '@nishans/types';

export const createDefaultRecordMap = () => {
	const recordMap: {
		space: ISpace[];
		block: TBlock[];
		collection: ICollection[];
		collection_view: TView[];
		notion_user: INotionUser[];
		space_view: ISpaceView[];
		user_root: IUserRoot[];
		user_settings: IUserSettings[];
	} = {} as any;

	NotionConstants.dataTypes().map((data_type) => (recordMap[data_type] = []));
	return recordMap;
};
