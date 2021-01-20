import { IHeader } from '@nishans/types';

export type FrontMatterKeys = 'title';

export type HeaderNotionBlock = {
	title: string;
	type: 'header';
};

export type TNotionBlocks = HeaderNotionBlock;
