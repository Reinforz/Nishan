import Data from './Data';

import { NishanArg } from '../types/types';
import { spaceViewUpdate } from '../utils/chunk';
import { ISpaceView } from '../types/api';

class SpaceView extends Data<ISpaceView> {
  constructor(arg: NishanArg<ISpaceView>) {
    super(arg);
    this.data = arg.data;
  }

  async update(arg: Partial<Pick<ISpaceView, 'notify_desktop' | 'notify_email' | 'notify_mobile'>>) {
    const {
      notify_email = this.data.notify_email,
      notify_desktop = this.data.notify_desktop,
      notify_mobile = this.data.notify_mobile
    } = arg;

    await this.saveTransactions([
      spaceViewUpdate(this.data.id, [], {
        notify_email,
        notify_desktop,
        notify_mobile
      })
    ]);

    this.updateCache('space_view', [
      ['notify_email', notify_email],
      ['notify_desktop', notify_desktop],
      ['notify_mobile', notify_mobile]
    ]);
  }
}

export default SpaceView;
