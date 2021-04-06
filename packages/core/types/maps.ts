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
	embed: Map<string, Block<IEmbed, IEmbedInput>>;
	abstract: Map<string, Block<IEmbed, IEmbedInput>>;
	invision: Map<string, Block<IEmbed, IEmbedInput>>;
	framer: Map<string, Block<IEmbed, IEmbedInput>>;
	whimsical: Map<string, Block<IEmbed, IEmbedInput>>;
	miro: Map<string, Block<IEmbed, IEmbedInput>>;
	loom: Map<string, Block<IEmbed, IEmbedInput>>;
	pdf: Map<string, Block<IEmbed, IEmbedInput>>;
	typeform: Map<string, Block<IEmbed, IEmbedInput>>;
	video: Map<string, Block<IVideo, IVideoInput>>;
	audio: Map<string, Block<IAudio, IAudioInput>>;
	image: Map<string, Block<IImage, IImageInput>>;
	bookmark: Map<string, Block<IWebBookmark, IWebBookmarkInput>>;
	code: Map<string, Block<ICode, ICodeInput>>;
	file: Map<string, Block<IFile, IFileInput>>;
	tweet: Map<string, Block<ITweet, ITweetInput>>;
	gist: Map<string, Block<IGist, IGistInput>>;
	codepen: Map<string, Block<ICodepen, ICodepenInput>>;
	maps: Map<string, Block<IMaps, IMapsInput>>;
	figma: Map<string, Block<IFigma, IFigmaInput>>;
	drive: Map<string, Block<IDrive, IDriveInput>>;
	text: Map<string, Block<IText, ITextInput>>;
	table_of_contents: Map<string, Block<ITOC, ITOCInput>>;
	equation: Map<string, Block<IEquation, IEquationInput>>;
	breadcrumb: Map<string, Block<IBreadcrumb, IBreadcrumbInput>>;
	factory: Map<string, Block<IFactory, IFactoryInput>>;
	page: Map<string, Page>;
	to_do: Map<string, Block<ITodo, ITodoInput>>;
	header: Map<string, Block<IHeader, IHeaderInput>>;
	sub_header: Map<string, Block<ISubHeader, ISubHeaderInput>>;
	sub_sub_header: Map<string, Block<ISubHeader, ISubHeaderInput>>;
	bulleted_list: Map<string, Block<IBulletedList, IBulletedListInput>>;
	numbered_list: Map<string, Block<INumberedList, INumberedListInput>>;
	toggle: Map<string, Block<IToggle, IToggleInput>>;
	quote: Map<string, Block<IQuote, IQuoteInput>>;
	divider: Map<string, Block<IDivider, IDividerInput>>;
	callout: Map<string, Block<ICallout, ICalloutInput>>;
	collection_view: Map<string, CollectionView>;
	collection_view_page: Map<string, CollectionViewPage>;
	linked_db: Map<string, CollectionView>;
	column_list: Map<string, Block<IColumnList, IColumnListInput>>;
	column: Map<string, Block<IColumn, any>>;
}
