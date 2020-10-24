import Data from './Data';

import { NishanArg } from '../types/types';
import { userSettingsUpdate } from '../utils/chunk';
import { IUserSettings, IUserSettingsSettings } from '../types/api';

class UserSettings extends Data<IUserSettings> {
  constructor(arg: NishanArg<IUserSettings>) {
    super(arg);
    this.data = arg.data;
  }

  async update(
    opt: Partial<
      Pick<
        IUserSettingsSettings,
        'start_day_of_week' | 'time_zone' | 'locale' | 'preferred_locale' | 'preferred_locale_origin'
      >
    >
  ) {
    const {
      start_day_of_week = this.data.settings.start_day_of_week,
      time_zone = this.data.settings.time_zone,
      locale = this.data.settings.locale,
      preferred_locale = this.data.settings.preferred_locale,
      preferred_locale_origin = this.data.settings.preferred_locale_origin
    } = opt;
    await this.saveTransactions([
      userSettingsUpdate(this.data.id, ['settings'], {
        start_day_of_week,
        time_zone,
        locale,
        preferred_locale,
        preferred_locale_origin
      })
    ]);

    this.updateCache('user_settings', [
      ['start_day_of_week', start_day_of_week],
      ['time_zone', time_zone],
      ['locale', locale],
      ['preferred_locale', preferred_locale],
      ['preferred_locale_origin', preferred_locale_origin]
    ]);
  }
}

export default UserSettings;
