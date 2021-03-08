import { getParentResolveType } from '../../../libs/Resolvers/utils';

describe('getParentResolveType', () => {
	it(`type = page`, () => {
		expect(getParentResolveType({ type: 'page' } as any)).toStrictEqual('Page');
	});
	it(`type = collection_view_page`, () => {
		expect(getParentResolveType({ type: 'collection_view_page' } as any)).toStrictEqual('CollectionViewPage');
	});
	it(`type = collection_view`, () => {
		expect(getParentResolveType({ type: 'collection_view' } as any)).toStrictEqual(undefined);
	});
	it(`type = space`, () => {
		expect(getParentResolveType({ pages: [] } as any)).toStrictEqual('Space');
	});
});
