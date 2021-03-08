import { getBlockResolveType } from '../../../libs/Resolvers/utils';

describe('getBlockResolveType', () => {
	it(`type = page`, () => {
		expect(getBlockResolveType({ type: 'page' } as any)).toStrictEqual('Page');
	});
	it(`type = collection_view_page`, () => {
		expect(getBlockResolveType({ type: 'collection_view_page' } as any)).toStrictEqual('CollectionViewPage');
	});
	it(`type = collection_view`, () => {
		expect(getBlockResolveType({ type: 'collection_view' } as any)).toStrictEqual('CollectionView');
	});
	it(`type = header`, () => {
		expect(getBlockResolveType({ type: 'header' } as any)).toStrictEqual(undefined);
	});
});
