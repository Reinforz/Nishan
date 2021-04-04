import { blockMetadata } from './blockMetadata';
import { collection } from './collection';
import { comment } from './comment';
import { discussion } from './discussion';
import { spaceView } from './spaceView';
import { NotionInitView } from './View';

export const NotionInit = {
	View: NotionInitView,
	blockMetadata,
	comment,
	discussion,
	spaceView,
	collection
};
