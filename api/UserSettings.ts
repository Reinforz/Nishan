import Data from './Data';

import { NishanArg, UpdatableUserSettingsParam, IUserSettings } from '../types';

/**
 * A class to represent user settings of Notion
 * @noInheritDoc
 */
class UserSettings extends Data<IUserSettings> {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "user_settings" });
  }

  /**
   * Update the current user settings
   * @param opt Options to update the User settings
   */
  async update(
    opt: UpdatableUserSettingsParam
  ) {
    const [op, update] = this.updateCacheLocally(opt, ['start_day_of_week',
      'time_zone',
      'locale',
      'preferred_locale',
      'preferred_locale_origin']);

    await this.saveTransactions([
      op
    ]);

    update();
  }
}

export default UserSettings;
