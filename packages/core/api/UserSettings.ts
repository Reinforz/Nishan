import Data from './Data';

import { NishanArg, IUserSettings, IUserSettingsUpdateInput, TUserSettingsUpdateKeys } from '../../types';

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
    opt: IUserSettingsUpdateInput,
    execute?: boolean
  ) {
    const [op, update] = this.updateCacheLocally(opt, TUserSettingsUpdateKeys);

    await this.executeUtil([
      op
    ], this.id, execute)
    this.logger && this.logger("UPDATE", "UserSettings", this.id)
    update();
  }
}

export default UserSettings;
