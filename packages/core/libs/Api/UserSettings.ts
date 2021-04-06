import { IUserSettings } from '@nishans/types';
import { INotionCoreOptions, IUserSettingsUpdateInput } from '../';
import Data from './Data';

/**
 * A class to represent user settings of Notion
 * @noInheritDoc
 */
class UserSettings extends Data<IUserSettings, IUserSettingsUpdateInput> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg, type: 'user_settings' });
	}
}

export default UserSettings;
