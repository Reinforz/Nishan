import * as BlockApi from './Block';
import Collection from './Collection';
import Comment from './Comment';
import NotionData from './Data';
import Discussion from './Discussion';
import Nishan from './Nishan';
import NotionUser from './NotionUser';
import SchemaUnit from './SchemaUnit';
import Space from './Space';
import SpaceView from './SpaceView';
import UserRoot from './UserRoot';
import UserSettings from './UserSettings';
import * as ViewApi from './View';

export const CoreApi = {
	...ViewApi,
	...BlockApi,
	Comment,
	Discussion,
	Nishan,
	Collection,
	NotionUser,
	UserSettings,
	UserRoot,
	SpaceView,
	Space,
	SchemaUnit,
	NotionData
};
