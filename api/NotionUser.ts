import Data from './Data';

import { NishanArg } from '../types/types';
import { INotionUser } from '../types/api';
import { UpdatableNotionUserParam } from '../types/function';

/**
 * A class to represent NotionUser of Notion
 * @noInheritDoc
 */
class NotionUser extends Data<INotionUser> {
  constructor(arg: NishanArg<INotionUser>) {
    super(arg);
  }

  /**
   * Update the notion user
   * @param opt `UpdatableNotionUserParam`
   */

  async update(opt: UpdatableNotionUserParam) {
    const [op, update] = this.updateCache(opt, ['family_name',
      'given_name',
      'profile_photo']);

    await this.saveTransactions([
      op
    ]);
    update();
  }
}

export default NotionUser;
