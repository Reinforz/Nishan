import Data from './Data';

import { NishanArg } from '../types/types';
import { IUserSettings } from '../types/api';
import { UpdatableUserSettingsParam } from '../types/function';

class UserSettings extends Data<IUserSettings> {
  constructor(arg: NishanArg<IUserSettings>) {
    super(arg);
  }

  async update(
    opt: UpdatableUserSettingsParam
  ) {
    const [op, update] = this.updateCache(opt, ['start_day_of_week',
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
