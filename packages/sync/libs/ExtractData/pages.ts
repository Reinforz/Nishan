import { IPage } from '@nishans/types';
import { PageExtracted } from '../';

export const extractPagesData = (row_pages: IPage[] | PageExtracted[]) => {
	return (row_pages as any).map(({ properties, format }: any) => {
		return {
			properties,
			format
		};
	});
};
