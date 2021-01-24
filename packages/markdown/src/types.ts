import { TTextFormat, TBlockType, TCodeLanguage } from '@nishans/types';

export type FrontMatterKeys = 'title';

type NotionBlock<T extends TBlockType> = {
	title: TTextFormat;
	type: T;
};

export interface HeaderNotionBlock extends NotionBlock<'header'> {}
export interface SubHeaderNotionBlock extends NotionBlock<'sub_header'> {}
export interface SubSubHeaderNotionBlock extends NotionBlock<'sub_sub_header'> {}
export interface TextNotionBlock extends NotionBlock<'text'> {}
export interface CodeNotionBlock extends NotionBlock<'code'> {
	lang: TCodeLanguage;
}
export interface NumberedListNotionBlock extends NotionBlock<'numbered_list'> {}

export interface DividerNotionBlock {
	type: 'divider';
}

export interface BulletedListNotionBlock extends NotionBlock<'bulleted_list'> {}
export interface QuoteNotionBlock extends NotionBlock<'quote'> {}
export type TNotionBlocks =
	| HeaderNotionBlock
	| SubHeaderNotionBlock
	| SubSubHeaderNotionBlock
	| TextNotionBlock
	| CodeNotionBlock
	| DividerNotionBlock
	| NumberedListNotionBlock
	| BulletedListNotionBlock
	| QuoteNotionBlock;

export interface NotionOperationData {
	shard_id: number;
	space_id: string;
	user_id: string;
	headers: {
		headers: {
			cookie: string;
			'x-notion-active-user-header': string;
		};
	};
}

export type NotionMarkdownConfig = Record<FrontMatterKeys, any>;
