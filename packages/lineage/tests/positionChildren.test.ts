import { NotionLogger } from '@nishans/logger';
import { IPage } from '@nishans/types';
import { o } from '../../core/tests/utils';
import { NotionLineage } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('NotionLineage.positionChildren', () => {
	it(`Should work when parent doesn't contain container`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id' } as any;
		const methodLoggerMock = jest.spyOn(NotionLogger.method, 'info').mockImplementation(() => undefined as any);
		const operation = NotionLineage.positionChildren<IPage>('content', {
			parent,
			child_id: 'child_id',
			position: 0,
			parent_type: 'block',
			logger: true
		});

		expect(parent.content[0]).toBe('child_id');
		expect(methodLoggerMock).toHaveBeenCalledWith(`UPDATE block parent_id`);
		expect(operation).toStrictEqual(
			o.b.la('parent_id', [ 'content' ], {
				after: '',
				id: 'child_id'
			})
		);
	});

	it(`Should work when position is a number`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id', content: [ 'child_1_id' ] } as any;
		const operation = NotionLineage.positionChildren<IPage>('content', {
			parent,
			child_id: 'child_id',
			position: 0,
			parent_type: 'block'
		});

		expect(parent.content[0]).toBe('child_id');
		expect(operation).toStrictEqual(
			o.b.lb('parent_id', [ 'content' ], {
				before: 'child_1_id',
				id: 'child_id'
			})
		);
	});

	it(`Should push to last if position not provided`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id', content: [] } as any;
		const operation = NotionLineage.positionChildren<IPage>('content', {
			parent,
			child_id: 'child_id',
			parent_type: 'block'
		});

		expect(parent.content.pop()).toBe('child_id');
		expect(operation).toStrictEqual(
			o.b.la('parent_id', [ 'content' ], {
				after: '',
				id: 'child_id'
			})
		);
	});

	it(`Should work when position is an object(position: After)`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id', content: [ 'child_1_id' ] } as any;
		const operation = NotionLineage.positionChildren<IPage>('content', {
			position: {
				id: 'child_1_id',
				position: 'After'
			},
			parent,
			child_id: 'child_id',
			parent_type: 'block'
		});

		expect(parent.content).toStrictEqual([ 'child_1_id', 'child_id' ]);
		expect(operation).toStrictEqual(
			o.b.la('parent_id', [ 'content' ], {
				after: 'child_1_id',
				id: 'child_id'
			})
		);
	});

	it(`Should work when position is an object(position: Before)`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id', content: [ 'child_1_id' ] } as any;
		const operation = NotionLineage.positionChildren<IPage>('content', {
			position: {
				id: 'child_1_id',
				position: 'Before'
			},
			parent,
			child_id: 'child_id',
			parent_type: 'block'
		});

		expect(parent.content).toStrictEqual([ 'child_id', 'child_1_id' ]);
		expect(operation).toStrictEqual(
			o.b.lb('parent_id', [ 'content' ], {
				before: 'child_1_id',
				id: 'child_id'
			})
		);
	});

	it(`Should throw an error if the pivot and content doesn't exist for number position`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id' } as any;
		delete (parent as any).content;
		expect(() =>
			NotionLineage.positionChildren<IPage>('content', {
				parent,
				child_id: 'child_id',
				position: 3,
				parent_type: 'block'
			})
		).toThrow();
	});

	it(`Should throw an error if the pivot doesn't exist for number position`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id', content: [] } as any;
		expect(() =>
			NotionLineage.positionChildren<IPage>('content', {
				parent,
				child_id: 'child_id',
				position: 3,
				parent_type: 'block'
			})
		).toThrow();
	});

	it(`Should throw an error if the pivot doesn't exist for object position`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id', content: [] } as any;
		expect(() =>
			NotionLineage.positionChildren<IPage>('content', {
				parent,
				child_id: 'child_id',
				position: {
					id: '456',
					position: 'After'
				},
				parent_type: 'block'
			})
		).toThrow();
	});
});
