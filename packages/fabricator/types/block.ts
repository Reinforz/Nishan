import { IDiscussionCreateInput } from '@nishans/discourse';
import { INotionRepositionParams } from '@nishans/lineage';
import {
	IAudio,
	IBreadcrumb,
	IBulletedList,
	ICallout,
	ICode,
	ICodepen,
	IDivider,
	IDrive,
	IEmbed,
	IEquation,
	IFactory,
	IFigma,
	IFile,
	IGist,
	IHeader,
	IImage,
	IMaps,
	INumberedList,
	IPage,
	IQuote,
	ISubHeader,
	ISubSubHeader,
	IText,
	ITOC,
	ITodo,
	IToggle,
	ITweet,
	IVideo,
	IWebBookmark,
	PageFormat,
	TBlockType,
	TPropertyVisibility,
	TTextFormat
} from '@nishans/types';
import { TSchemaUnitInput, TViewCreateInput } from './';

export interface ICollectionBlockInput {
	id?: string;
	views: TViewCreateInput[];
	schema: (TSchemaUnitInput & { property_visibility?: TPropertyVisibility })[];
	name: TTextFormat;
	icon?: string;
	cover?: string;
	rows: IPageCreateInput[];
	collection_id?: string;
	page_section_visibility?: PageFormat['page_section_visibility'];
}

export interface ICollectionViewInput extends ICollectionBlockInput {
	type: 'collection_view';
}

export interface ICollectionViewPageInput extends ICollectionBlockInput {
	type: 'collection_view_page';
	isPrivate?: boolean;
}

interface IBlockInput {
	id?: string;
	type: TBlockType;
	discussions?: IDiscussionCreateInput[];
}

export interface ILinkedDBInput extends IBlockInput {
	type: 'linked_db';
	collection_id: string;
	properties?: Record<string, unknown>;
	format?: Record<string, unknown>;
	views: TViewCreateInput[];
}

export type TCollectionBlockInput = ICollectionViewInput | ICollectionViewPageInput;

// -----------------

// Media IBlock Input

export interface IVideoInput extends IBlockInput {
	type: 'video';
	properties: IVideo['properties'];
	format?: IVideo['format'];
}

export interface IImageInput extends IBlockInput {
	type: 'image';
	properties: IImage['properties'];
	format?: IImage['format'];
}

export interface IAudioInput extends IBlockInput {
	type: 'audio';
	properties: IAudio['properties'];
	format?: IAudio['format'];
}

export interface IWebBookmarkInput extends IBlockInput {
	type: 'bookmark';
	properties: IWebBookmark['properties'];
	format?: IWebBookmark['format'];
}

// Basic block input
export interface ICodeInput extends IBlockInput {
	type: 'code';
	properties: ICode['properties'];
	format?: ICode['format'];
}

export interface IFileInput extends IBlockInput {
	type: 'file';
	properties: IFile['properties'];
	format?: IFile['format'];
}

export type TMediaBlockInput = IVideoInput | IImageInput | IAudioInput | IWebBookmarkInput | ICodeInput | IFileInput;

// Basic IBlock Input

export interface IColumnListInput extends IBlockInput {
	type: 'column_list';
	contents: {
		id?: string;
		contents: TBlockInput[];
	}[];
}

export interface IPageCreateInput extends IBlockInput {
	type: 'page';
	properties: IPage['properties'];
	format?: Partial<IPage['format']>;
	isPrivate?: boolean;
	contents: TBlockInput[];
	is_template?: boolean;
	isBookmarked?: true;
}

export interface IPageUpdateInput {
	properties: Partial<IPage['properties']>;
	format?: Partial<IPage['format']>;
	isPrivate?: boolean;
	type: 'page';
}

export interface ICollectionViewPageUpdateInput {
	type: 'collection_view_page';
	cover?: string;
	icon?: string;
	isPrivate?: boolean;
	title?: string[][];
}

export interface ITextInput extends IBlockInput {
	properties: IText['properties'];
	format?: IText['format'];
	type: 'text';
}

export interface IHeaderInput extends IBlockInput {
	properties: IHeader['properties'];
	format?: IHeader['format'];
	type: 'header';
}

export interface ISubHeaderInput extends IBlockInput {
	properties: ISubHeader['properties'];
	format?: ISubHeader['format'];
	type: 'sub_header';
}

export interface ISubSubHeaderInput extends IBlockInput {
	properties: ISubSubHeader['properties'];
	format?: ISubSubHeader['format'];
	type: 'sub_sub_header';
}

export interface INumberedListInput extends IBlockInput {
	properties: INumberedList['properties'];
	format?: INumberedList['format'];
	type: 'numbered_list';
}

export interface IBulletedListInput extends IBlockInput {
	properties: IBulletedList['properties'];
	format?: IBulletedList['format'];
	type: 'bulleted_list';
}

export interface IToggleInput extends IBlockInput {
	properties: IToggle['properties'];
	format?: IToggle['format'];
	type: 'toggle';
}

export interface IQuoteInput extends IBlockInput {
	properties: IQuote['properties'];
	format?: IQuote['format'];
	type: 'quote';
}

export interface ILinkToPageInput {
	type: 'link_to_page';
	page_id: string;
}

export interface IDividerInput extends IBlockInput {
	type: 'divider';
	properties?: IDivider['properties'];
	format?: IDivider['format'];
}

export interface ICalloutInput extends IBlockInput {
	type: 'callout';
	format?: ICallout['format'];
	properties?: ICallout['properties'];
}

export interface ITodoInput extends IBlockInput {
	type: 'to_do';
	properties: ITodo['properties'];
	format?: ITodo['format'];
}

export type TBasicBlockInput =
	| ILinkToPageInput
	| IPageCreateInput
	| ITodoInput
	| ICalloutInput
	| IDividerInput
	| IQuoteInput
	| IToggleInput
	| IBulletedListInput
	| INumberedListInput
	| ISubSubHeaderInput
	| ISubHeaderInput
	| IHeaderInput
	| ITextInput;
// Advanced block input
export interface ITOCInput extends IBlockInput {
	type: 'table_of_contents';
	format?: ITOC['format'];
	properties?: ITOC['properties'];
}

export interface IEquationInput extends IBlockInput {
	type: 'equation';
	properties: IEquation['properties'];
	format?: IEquation['format'];
}

export interface IFactoryInput extends IBlockInput {
	type: 'factory';
	properties: IFactory['properties'];
	format?: IFactory['format'];
	contents: TBlockInput[];
}

export interface IBreadcrumbInput extends IBlockInput {
	type: 'breadcrumb';
	properties?: IBreadcrumb['properties'];
	format?: IBreadcrumb['format'];
}

export type TAdvancedBlockInput = IBreadcrumbInput | IFactoryInput | IEquationInput | ITOCInput;

// Embed block input
export interface IEmbedInput extends IBlockInput {
	type: 'embed';
	properties: IEmbed['properties'];
	format?: Partial<IEmbed['format']>;
}

export interface IDriveInput extends IBlockInput {
	type: 'drive';
	properties?: IDrive['properties'];
	format?: IDrive['format'];
	file_id: string;
}

export interface ITweetInput extends IBlockInput {
	type: 'tweet';
	properties: ITweet['properties'];
	format?: ITweet['format'];
}

export interface ICodepenInput extends IBlockInput {
	type: 'codepen';
	properties: ICodepen['properties'];
	format?: ICodepen['format'];
}

export interface IMapsInput extends IBlockInput {
	type: 'maps';
	properties: IMaps['properties'];
	format?: IMaps['format'];
}

export interface IGistInput extends IBlockInput {
	type: 'gist';
	properties: IGist['properties'];
	format?: IGist['format'];
}

export interface IFigmaInput extends IBlockInput {
	type: 'figma';
	properties: IFigma['properties'];
	format?: IFigma['format'];
}

export type TEmbedBlockInput =
	| IEmbedInput
	| IFigmaInput
	| IMapsInput
	| ICodepenInput
	| IDriveInput
	| IGistInput
	| ITweetInput;

export type TBlockInput =
	| TMediaBlockInput
	| TBasicBlockInput
	| TAdvancedBlockInput
	| TEmbedBlockInput
	| TCollectionBlockInput
	| IColumnListInput
	| ILinkedDBInput;

export type TBlockCreateInput = TBlockInput & {
	position?: INotionRepositionParams;
};
