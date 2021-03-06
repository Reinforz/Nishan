import { IGalleryView } from '@nishans/types';
import { INotionCoreOptions } from '../../';
import View from './View';

/**
 * A class to represent gallery view of Notion
 * @noInheritDoc
 */

class GalleryView extends View<IGalleryView> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg });
	}
}

export default GalleryView;
