import { IUserSettings } from '@nishans/types';
import { NishanArg, IUserSettingsUpdateInput, TUserSettingsUpdateKeys } from '../types';
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
	async update (opt: IUserSettingsUpdateInput, execute?: boolean) {
		await this.updateCacheLocally(opt, TUserSettingsUpdateKeys, execute);
	}
}

export default UserSettings;
