import {
	ISpace,
	TCreditType,
	TFormatBlockColor,
	TCodeLanguage,
	IBlock,
	LastEditedProps,
	Schema,
	IPermission,
	TPermissionRole,
	Node,
	ParentProps,
	CreateProps,
	SpaceShardProps
} from '.';

export type TGenericEmbedBlockType = 'figma' | 'tweet' | 'codepen' | 'gist' | 'maps';
export type TMediaBlockType = 'code' | 'image' | 'video' | 'bookmark' | 'audio' | 'file';
export type TBasicBlockType =
	| 'page'
	| 'text'
	| 'header'
	| 'sub_header'
	| 'sub_sub_header'
	| 'to_do'
	| 'bulleted_list'
	| 'numbered_list'
	| 'toggle'
	| 'quote'
	| 'divider'
	| 'callout'
	| 'link_to_page';
export type TAdvancedBlockType = 'table_of_contents' | 'equation' | 'factory' | 'breadcrumb';
export type TEmbedsBlockType = 'embed' | 'drive' | TGenericEmbedBlockType;
export type TCollectionBlockType = 'collection_view_page' | 'collection_view' | 'linked_db';
export type TColumnBlockType = 'column_list' | 'column';
export type TBlockType =
	| TEmbedsBlockType
	| TMediaBlockType
	| TBasicBlockType
	| TAdvancedBlockType
	| TCollectionBlockType
	| TColumnBlockType;

export interface MediaProps {
	source: string[][];
	caption?: string[][];
}

export interface MediaFormat {
	block_aspect_ratio?: number;
	block_full_width?: boolean;
	block_page_width?: boolean;
	block_preserve_scale?: boolean;
	block_width?: number;
	block_height?: number;
	display_source: string;
}

export interface WebBookmarkFormat {
	bookmark_cover: string;
	bookmark_icon: string;
	block_color?: TFormatBlockColor;
}

export interface WebBookmarkProps {
	link: string[][];
	description: string[][];
	title: string[][];
	caption?: string[][];
}

export interface CodeFormat {
	code_wrap: boolean;
}

export interface CodeProps {
	title: string[][];
	language: TCodeLanguage;
}

export interface FileProps {
	title: string[][];
	source: string[][];
	caption?: string[][];
}

export interface FileFormat {
	block_color?: TFormatBlockColor;
}

export interface TodoProps {
	title: string[][];
	checked: ('Yes' | 'No')[][];
}

// -----------------

export interface IMedia {
	properties: MediaProps;
	format?: MediaFormat;
	file_ids: string[];
}

export interface ICommonText {
	properties: {
		title: string[][];
	};
	format?: {
		block_color?: TFormatBlockColor;
	};
}
export interface IVideo extends IBlock, IMedia {
	type: 'video';
}
export interface IAudio extends IBlock, IMedia {
	type: 'audio';
}
export interface IImage extends IBlock, IMedia {
	type: 'image';
}
export interface IWebBookmark extends IBlock {
	type: 'bookmark';
	properties: WebBookmarkProps;
	format?: WebBookmarkFormat;
}

export interface ICode extends IBlock {
	type: 'code';
	properties: CodeProps;
	format?: CodeFormat;
}
export interface IFile extends IBlock {
	type: 'file';
	properties: FileProps;
	format?: FileFormat;
}

export type TMediaBlock = IVideo | IAudio | IImage | IWebBookmark | ICode | IFile;

// Basic IBlock Types
export interface PageProps {
	title: string[][];
	[k: string]: string[][];
}

export interface PageFormat {
	page_icon: string;
	page_font: string;
	page_full_width: boolean;
	page_small_text: boolean;
	block_locked_by: string;
	block_locked: boolean;
	page_cover: string;
	page_cover_position: number;
	block_color?: TFormatBlockColor;
	page_section_visibility: {
		backlinks: 'section_show' | 'section_hide' | 'section_collapsed';
		comments: 'section_hide' | 'section_show';
	};
}

export interface IPage extends IBlock {
	properties: PageProps;
	type: 'page';
	content: string[];
	format?: PageFormat;
	is_template?: boolean;
	file_ids?: string[];
	permissions: IPermission[];
}

export interface IColumnFormat {
	format: {
		column_ratio: 0.5;
	};
}

export interface IColumn extends Node, ParentProps, CreateProps, LastEditedProps, IColumnFormat, SpaceShardProps {
	content: string[];
	type: 'column';
	properties?: Record<string, unknown>;
}

export interface IColumnList extends Node, ParentProps, CreateProps, LastEditedProps, SpaceShardProps {
	content: string[];
	type: 'column_list';
	format?: Record<string, unknown>;
	properties?: Record<string, unknown>;
}

export interface ICollectionBlock extends IBlock {
	view_ids: string[];
	collection_id: string;
	type: 'collection_view' | 'collection_view_page';
	properties?: Record<string, unknown>;
	format?: Record<string, unknown>;
}

export interface ICollectionView extends ICollectionBlock {
	type: 'collection_view';
}

export interface ICollectionViewPage extends ICollectionBlock {
	type: 'collection_view_page';
	permissions: IPermission[];
}

export type TCollectionBlock = ICollectionView | ICollectionViewPage;

export interface IText extends IBlock, ICommonText {
	type: 'text';
}
export interface ITodo extends IBlock {
	type: 'todo';
	properties: TodoProps;
	format?: {
		block_color?: TFormatBlockColor;
	};
}
export interface IHeader extends IBlock, ICommonText {
	type: 'header';
}
export interface ISubHeader extends IBlock, ICommonText {
	type: 'sub_header';
}
export interface ISubSubHeader extends IBlock, ICommonText {
	type: 'sub_sub_header';
}
export interface IBulletedList extends IBlock, ICommonText {
	type: 'bulleted_list';
}
export interface INumberedList extends IBlock, ICommonText {
	type: 'numbered_list';
}
export interface IToggle extends IBlock, ICommonText {
	type: 'toggle';
}
export interface IQuote extends IBlock, ICommonText {
	type: 'quote';
}
export interface IDivider extends IBlock {
	type: 'divider';
	properties?: Record<string, unknown>;
	format?: Record<string, unknown>;
}
export interface ICallout extends IBlock, ICommonText {
	type: 'callout';
}

export type TBasicBlock =
	| IText
	| ITodo
	| IHeader
	| ISubHeader
	| ISubSubHeader
	| IBulletedList
	| INumberedList
	| IToggle
	| IQuote
	| IDivider
	| ICallout
	| IPage
	| TCollectionBlock;

// Advanced block types
export interface ITOC extends IBlock {
	type: 'table_of_contents';
	format?: {
		block_color?: TFormatBlockColor;
	};
	properties?: Record<string, unknown>;
}

export interface IEquation extends IBlock {
	type: 'equation';
	properties: {
		title: string[][];
	};
	format?: {
		block_color?: TFormatBlockColor;
	};
}

export interface IBreadcrumb extends IBlock {
	type: 'breadcrumb';
	properties?: Record<string, unknown>;
	format?: Record<string, unknown>;
}
export interface IFactory extends IBlock {
	type: 'factory';
	properties: {
		title: string[][];
	};
	format?: {
		block_color?: TFormatBlockColor;
	};
	contents: string[];
}

export type TAdvancedBlock = ITOC | IEquation | IBreadcrumb | IFactory;

// Embeds Type
export interface IGist extends IBlock {
	type: 'gist';
	properties: {
		source: string[][];
	};
	format?: {
		block_color?: TFormatBlockColor;
		display_source: null;
	};
}
export interface IDrive extends IBlock {
	type: 'drive';
	properties?: Record<string, unknown>;
	format?: {
		drive_properties: {
			file_id: string;
			icon: string;
			modified_time: number;
			title: string;
			trashed: boolean;
			url: string;
			user_name: string;
		};
		drive_status: {
			authed: boolean;
			last_fetched: number;
		};
	};
	file_id: string;
}
export interface ITweet extends IBlock {
	type: 'tweet';
	properties: {
		source: string[][];
	};
	format?: Record<string, unknown>;
}
export interface IEmbed extends IBlock {
	properties: MediaProps;
	format?: MediaFormat;
	type: 'embed';
}
export interface ICodepen extends IBlock {
	type: 'codepen';
	properties: {
		source: string[][];
	};
	format?: MediaFormat;
}
export interface IMaps extends IBlock {
	type: 'maps';
	properties: {
		source: string[][];
	};
	format?: MediaFormat;
}
export interface IFigma extends IBlock {
	type: 'figma';
	properties: {
		source: string[][];
	};
	format?: MediaFormat;
}

export type TEmbedBlock = IEmbed | ITweet | ICodepen | IMaps | IFigma | IDrive | IGist;

export type TBlock = TBasicBlock | TMediaBlock | TAdvancedBlock | TEmbedBlock | IColumnList | IColumn;

export type TParentType = IPage | ISpace | ICollectionViewPage;

export interface ICollection extends Node, ParentProps {
	description?: string[][];
	icon?: string;
	migrated: boolean;
	name: string[][];
	schema: Schema;
	template_pages?: string[];
}

export interface IMember {
	userId: string;
	role: TPermissionRole;
	guestPageIds: string[];
}

export interface ICredit {
	activated: boolean;
	amount: number;
	created_timestamp: string;
	id: string;
	type: TCreditType;
	user_id: string;
	version: number;
}
