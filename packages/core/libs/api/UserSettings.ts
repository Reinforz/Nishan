import { IUserSettings } from '@nishans/types';
import { INotionCoreOptions, IUserSettingsUpdateInput, TUserSettingsUpdateKeys } from '../';
import Data from './Data';

/**
 * A class to represent user settings of Notion
 * @noInheritDoc
 */
class UserSettings extends Data<IUserSettings> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg, type: 'user_settings' });
	}

	/**
   * Update the current user settings
   * @param opt Options to update the User settings
   */
	async update (opt: IUserSettingsUpdateInput) {
		await this.updateCacheLocally(opt, TUserSettingsUpdateKeys);
	}
}

export default UserSettings;
