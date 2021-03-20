import { NotionConstants } from '@nishans/constants';
import {
	ICollection,
	IComment,
	IDiscussion,
	IFollow,
	INotionUser,
	IPageVisits,
	ISlackIntegration,
	ISpace,
	ISpaceView,
	IUserRoot,
	IUserSettings,
	TActivity,
	TBlock,
	TNotification,
	TView
} from '@nishans/types';

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
		comment: IComment[];
		discussion: IDiscussion[];
		follow: IFollow[];
		slack_integration: ISlackIntegration[];
		page_visits: IPageVisits[];
		activity: TActivity[];
		notification: TNotification[];
	} = {} as any;

	NotionConstants.dataTypes().map((data_type) => (recordMap[data_type] = []));
	return recordMap;
};
