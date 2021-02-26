import { IGalleryView } from '@nishans/types';
import { NishanArg } from '../../';
import View from './View';

/**
 * A class to represent gallery view of Notion
 * @noInheritDoc
 */

class GalleryView extends View<IGalleryView> {
	constructor (arg: NishanArg) {
		super({ ...arg });
	}
}

export default GalleryView;
