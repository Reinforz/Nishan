// import { v4 as uuidv4 } from 'uuid';

import Getters from "./Getters";

import { ISpaceView, NishanArg } from '../types';

class SpaceView extends Getters {
  space_view_data: ISpaceView
  constructor(arg: NishanArg & { space_view_data: ISpaceView }) {
    super(arg)
    this.space_view_data = arg.space_view_data;
  }
}

export default SpaceView;