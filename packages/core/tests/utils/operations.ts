import { Operation } from '@nishans/operations';
export const o = {
	b: {
		u: Operation.block.update,
		s: Operation.block.set,
		la: Operation.block.listAfter,
		lb: Operation.block.listBefore,
		lr: Operation.block.listRemove
	},
	sv: {
		u: Operation.space_view.update,
		s: Operation.space_view.set,
		la: Operation.space_view.listAfter,
		lb: Operation.space_view.listBefore,
		lr: Operation.space_view.listRemove
	},
	c: {
		u: Operation.collection.update,
		s: Operation.collection.set
	},
	s: {
		u: Operation.space.update,
		s: Operation.space.set
	},
	cv: {
		u: Operation.collection_view.update,
		s: Operation.collection_view.set
	}
};
