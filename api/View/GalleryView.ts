import { IGalleryView, NishanArg } from "../../types";
import View from "./View";

class GalleryView extends View<IGalleryView> {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }
}

export default GalleryView;