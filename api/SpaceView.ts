import Data from './Data';

import { NishanArg } from '../types/types';
import { ISpaceView } from '../types/api';
import { UpdatableSpaceViewParam } from '../types/function';

class SpaceView extends Data<ISpaceView> {
  constructor(arg: NishanArg<ISpaceView>) {
    super(arg);
  }

  async update(arg: UpdatableSpaceViewParam) {
    const [op, update] = this.updateCache(arg, ['notify_email',
      'notify_desktop',
      'notify_mobile'])
    await this.saveTransactions([
      op
    ]);
    update();
  }
}

export default SpaceView;
