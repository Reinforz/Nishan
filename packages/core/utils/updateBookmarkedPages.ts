import { Operation } from '@nishans/operations';
import { IOperation, ISpaceView } from '@nishans/types';

export function updateBookmarkedPages (
	data: ISpaceView,
	updated_favourite_status: boolean,
	id: string,
	stack: IOperation[]
) {
	const bookmarked_pages = data.bookmarked_pages as string[];
	if (!updated_favourite_status && bookmarked_pages.includes(id)) {
		data.bookmarked_pages = bookmarked_pages.filter((page_id) => page_id !== id);
		stack.push(
			Operation.space_view.listRemove(data.id, [ 'bookmarked_pages' ], {
				id
			})
		);
	} else if (updated_favourite_status && !bookmarked_pages.includes(id)) {
		bookmarked_pages.push(id);
		stack.push(
			Operation.space_view.listAfter(data.id, [ 'bookmarked_pages' ], {
				id
			})
		);
	}
}
