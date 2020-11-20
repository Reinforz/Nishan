import { NishanArg } from "../../types";
import View from "./View";

class GalleryView extends View {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }
}

export default GalleryView;