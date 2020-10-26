import Data from './Data';

import { NishanArg } from '../types/types';
import { notionUserUpdate } from '../utils/chunk';
import { INotionUser } from '../types/api';
import { UpdatableNotionUserParam } from '../types/function';

class NotionUser extends Data<INotionUser> {
  constructor(arg: NishanArg<INotionUser>) {
    super(arg);
    this.data = arg.data;
  }

  async update(opt: UpdatableNotionUserParam) {
    const {
      family_name = this.data.family_name,
      given_name = this.data.given_name,
      profile_photo = this.data.profile_photo
    } = opt;
    await this.saveTransactions([
      notionUserUpdate(this.data.id, [], {
        family_name,
        given_name,
        profile_photo
      })
    ]);
    this.updateCache([
      ['family_name', family_name],
      ['given_name', given_name],
      ['profile_photo', profile_photo]
    ]);
  }
}

export default NotionUser;
