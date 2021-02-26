import { IUserSettings } from '@nishans/types';
import { IUserSettingsUpdateInput, NishanArg, TUserSettingsUpdateKeys } from '../';
import Data from './Data';

/**
 * A class to represent user settings of Notion
 * @noInheritDoc
 */
class UserSettings extends Data<IUserSettings> {
	constructor (arg: NishanArg) {
		super({ ...arg, type: 'user_settings' });
	}

	/**
   * Update the current user settings
   * @param opt Options to update the User settings
   */
	update (opt: IUserSettingsUpdateInput) {
		this.updateCacheLocally(opt, TUserSettingsUpdateKeys);
	}
}

export default UserSettings;
