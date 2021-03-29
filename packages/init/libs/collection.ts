import { ICollection } from '@nishans/types';

export const collection = (
	arg: Pick<ICollection, 'id' | 'schema' | 'cover' | 'icon' | 'parent_id' | 'name' | 'format'>
) => {
	return {
		id: arg.id,
		schema: arg.schema,
		cover: arg.cover,
		icon: arg.icon,
		parent_id: arg.parent_id,
		parent_table: 'block',
		alive: true,
		name: arg.name,
		migrated: false,
		version: 0,
		format: arg.format
	} as ICollection;
};
