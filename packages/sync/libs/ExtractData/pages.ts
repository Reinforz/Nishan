import { IPage } from '@nishans/types';
import { PageExtracted } from '../';

export const extractPagesData = (row_pages: (IPage | PageExtracted)[]) =>
	row_pages.map((page) => ({
		properties: page.properties,
		format: page.format
	}));
