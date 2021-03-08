import { ICollection } from '@nishans/types';
import { CollectionExtracted } from '../..';

export const extractCollectionData = ({
	description,
	name,
	icon,
	cover,
	schema
}: ICollection | CollectionExtracted) => {
	return {
		name,
		icon,
		cover,
		description,
		schema
	} as CollectionExtracted;
};
