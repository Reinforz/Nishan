import {
	IAudioInput,
	IBreadcrumbInput,
	IBulletedListInput,
	ICalloutInput,
	ICodeInput,
	ICodepenInput,
	IColumnListInput,
	IDividerInput,
	IDriveInput,
	IEmbedInput,
	IEquationInput,
	IFactoryInput,
	IFigmaInput,
	IFileInput,
	IGistInput,
	IHeaderInput,
	IImageInput,
	IMapsInput,
	INumberedListInput,
	IQuoteInput,
	ISubHeaderInput,
	ITextInput,
	ITOCInput,
	ITodoInput,
	IToggleInput,
	ITweetInput,
	IVideoInput,
	IWebBookmarkInput
} from '@nishans/fabricator';
import {
	CheckboxSchemaUnit,
	CreatedBySchemaUnit,
	CreatedTimeSchemaUnit,
	DateSchemaUnit,
	EmailSchemaUnit,
	FileSchemaUnit,
	FormulaSchemaUnit,
	IAudio,
	IBreadcrumb,
	IBulletedList,
	ICallout,
	ICode,
	ICodepen,
	IColumn,
	IColumnList,
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
	IText,
	ITOC,
	ITodo,
	IToggle,
	ITweet,
	IVideo,
	IWebBookmark,
	LastEditedBySchemaUnit,
	LastEditedTimeSchemaUnit,
	MultiSelectSchemaUnit,
	NumberSchemaUnit,
	PersonSchemaUnit,
	PhoneNumberSchemaUnit,
	RelationSchemaUnit,
	RollupSchemaUnit,
	SelectSchemaUnit,
	TextSchemaUnit,
	TitleSchemaUnit,
	UrlSchemaUnit
} from '@nishans/types';
import { Block, CollectionView, CollectionViewPage, Page } from '../libs/Api/Block';
import SchemaUnit from '../libs/Api/SchemaUnit';
import { BoardView, CalendarView, GalleryView, ListView, TableView, TimelineView } from '../libs/Api/View';

export interface IPageMap {
	collection_view_page: Map<string, CollectionViewPage>;
	page: Map<string, Page>;
}

export interface ISchemaUnitMap {
	text: Map<string, SchemaUnit<TextSchemaUnit>>;
	number: Map<string, SchemaUnit<NumberSchemaUnit>>;
	select: Map<string, SchemaUnit<SelectSchemaUnit>>;
	multi_select: Map<string, SchemaUnit<MultiSelectSchemaUnit>>;
	title: Map<string, SchemaUnit<TitleSchemaUnit>>;
	date: Map<string, SchemaUnit<DateSchemaUnit>>;
	person: Map<string, SchemaUnit<PersonSchemaUnit>>;
	file: Map<string, SchemaUnit<FileSchemaUnit>>;
	checkbox: Map<string, SchemaUnit<CheckboxSchemaUnit>>;
	url: Map<string, SchemaUnit<UrlSchemaUnit>>;
	email: Map<string, SchemaUnit<EmailSchemaUnit>>;
	phone_number: Map<string, SchemaUnit<PhoneNumberSchemaUnit>>;
	formula: Map<string, SchemaUnit<FormulaSchemaUnit>>;
	relation: Map<string, SchemaUnit<RelationSchemaUnit>>;
	rollup: Map<string, SchemaUnit<RollupSchemaUnit>>;
	created_time: Map<string, SchemaUnit<CreatedTimeSchemaUnit>>;
	created_by: Map<string, SchemaUnit<CreatedBySchemaUnit>>;
	last_edited_time: Map<string, SchemaUnit<LastEditedTimeSchemaUnit>>;
	last_edited_by: Map<string, SchemaUnit<LastEditedBySchemaUnit>>;
}

export interface IViewMap {
	table: Map<string, TableView>;
	gallery: Map<string, GalleryView>;
	list: Map<string, ListView>;
	board: Map<string, BoardView>;
	timeline: Map<string, TimelineView>;
	calendar: Map<string, CalendarView>;
}

export interface IBlockMap {
	embed: Map<string, Block<IEmbed, IEmbedInput, IPage>>;
	abstract: Map<string, Block<IEmbed, IEmbedInput, IPage>>;
	invision: Map<string, Block<IEmbed, IEmbedInput, IPage>>;
	framer: Map<string, Block<IEmbed, IEmbedInput, IPage>>;
	whimsical: Map<string, Block<IEmbed, IEmbedInput, IPage>>;
	miro: Map<string, Block<IEmbed, IEmbedInput, IPage>>;
	loom: Map<string, Block<IEmbed, IEmbedInput, IPage>>;
	pdf: Map<string, Block<IEmbed, IEmbedInput, IPage>>;
	typeform: Map<string, Block<IEmbed, IEmbedInput, IPage>>;
	video: Map<string, Block<IVideo, IVideoInput, IPage>>;
	audio: Map<string, Block<IAudio, IAudioInput, IPage>>;
	image: Map<string, Block<IImage, IImageInput, IPage>>;
	bookmark: Map<string, Block<IWebBookmark, IWebBookmarkInput, IPage>>;
	code: Map<string, Block<ICode, ICodeInput, IPage>>;
	file: Map<string, Block<IFile, IFileInput, IPage>>;
	tweet: Map<string, Block<ITweet, ITweetInput, IPage>>;
	gist: Map<string, Block<IGist, IGistInput, IPage>>;
	codepen: Map<string, Block<ICodepen, ICodepenInput, IPage>>;
	maps: Map<string, Block<IMaps, IMapsInput, IPage>>;
	figma: Map<string, Block<IFigma, IFigmaInput, IPage>>;
	drive: Map<string, Block<IDrive, IDriveInput, IPage>>;
	text: Map<string, Block<IText, ITextInput, IPage>>;
	table_of_contents: Map<string, Block<ITOC, ITOCInput, IPage>>;
	equation: Map<string, Block<IEquation, IEquationInput, IPage>>;
	breadcrumb: Map<string, Block<IBreadcrumb, IBreadcrumbInput, IPage>>;
	factory: Map<string, Block<IFactory, IFactoryInput, IPage>>;
	page: Map<string, Page>;
	to_do: Map<string, Block<ITodo, ITodoInput, IPage>>;
	header: Map<string, Block<IHeader, IHeaderInput, IPage>>;
	sub_header: Map<string, Block<ISubHeader, ISubHeaderInput, IPage>>;
	sub_sub_header: Map<string, Block<ISubHeader, ISubHeaderInput, IPage>>;
	bulleted_list: Map<string, Block<IBulletedList, IBulletedListInput, IPage>>;
	numbered_list: Map<string, Block<INumberedList, INumberedListInput, IPage>>;
	toggle: Map<string, Block<IToggle, IToggleInput, IPage>>;
	quote: Map<string, Block<IQuote, IQuoteInput, IPage>>;
	divider: Map<string, Block<IDivider, IDividerInput, IPage>>;
	callout: Map<string, Block<ICallout, ICalloutInput, IPage>>;
	collection_view: Map<string, CollectionView>;
	collection_view_page: Map<string, CollectionViewPage>;
	linked_db: Map<string, CollectionView>;
	column_list: Map<string, Block<IColumnList, IColumnListInput, IPage>>;
	column: Map<string, Block<IColumn, any, IPage>>;
}
