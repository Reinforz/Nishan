import { IAudio, IBreadcrumb, IBulletedList, ICallout, ICode, ICodepen, ICollection, IDivider, IDrive, IEmbed, IEquation, IFactory, IFigma, IFile, IGist, IHeader, IImage, IMaps, INotionUser, INumberedList, IPage, IQuote, ISpace, ISpaceView, ISubHeader, ISubSubHeader, IText, ITOC, ITodo, IToggle, ITweet, IUserSettingsSettings, IVideo, IWebBookmark, TBlockType, TTextFormat } from "@nishans/types";
import { TSchemaUnitInput } from "./schema";
import { ElementType } from "./utils";
import { TViewCreateInput } from "./view";

interface IInput {
  id?: string,
  type: TBlockType
}

export interface ICollectionBlockInput {
  id?: string,
  views: TViewCreateInput[],
  schema: TSchemaUnitInput[],
  name: TTextFormat,
  icon?: string;
  cover?: string;
  rows?: IPageCreateInput[],
  collection_id?:string
}

export interface ICollectionViewInput extends ICollectionBlockInput {
  type: "collection_view",
}

export interface ICollectionViewPageInput extends ICollectionBlockInput {
  type: "collection_view_page",
  isPrivate?: boolean
}

export interface ILinkedDBInput extends IInput {
  type: "linked_db",
  collection_id: string,
  properties?: Record<string, unknown>,
  format?: Record<string, unknown>,
  views: TViewCreateInput[],
}

export type TCollectionBlockInput = ICollectionViewInput | ICollectionViewPageInput | ILinkedDBInput;

// -----------------

// Media IBlock Input

export interface IVideoInput extends IInput {
  type: 'video',
  properties: IVideo["properties"],
  format?: IVideo["format"],
}

export interface IImageInput extends IInput {
  type: 'image',
  properties: IImage["properties"],
  format?: IImage["format"],
}

export interface IAudioInput extends IInput {
  type: 'audio',
  properties: IAudio["properties"],
  format?: IAudio["format"],
}

export interface IWebBookmarkInput extends IInput {
  type: 'bookmark',
  properties: IWebBookmark["properties"],
  format?: IWebBookmark["format"]
}

// Basic block input
export interface ICodeInput extends IInput {
  type: 'code',
  properties: ICode["properties"]
  format?: ICode["format"]
}

export interface IFileInput extends IInput {
  type: 'file',
  properties: IFile["properties"]
  format?: IFile["format"]
}

export type TMediaBlockInput = IVideoInput | IImageInput | IAudioInput | IWebBookmarkInput | ICodeInput | IFileInput;

// Basic IBlock Input

export interface IColumnListInput extends IInput {
  type: "column_list",
  contents: TBlockInput[]
}

export interface IPageCreateInput extends IInput {
  type: 'page',
  properties: IPage["properties"],
  format?: Partial<IPage["format"]>,
  isPrivate?: boolean,
  contents?: TBlockInput[],
  is_template?: boolean
}

export interface IPageUpdateInput {
  properties: Partial<IPage["properties"]>,
  format?: Partial<IPage["format"]>,
  isPrivate?: boolean,
  type: "page"
}

export interface ICollectionViewPageUpdateInput{
  type: "collection_view_page";
  cover?:string;
  icon?:string;
  isPrivate?:boolean
  title?:string[][]
}

export interface ITextInput extends IInput {
  properties: IText["properties"],
  format?: IText["format"],
  type: 'text'
}

export interface IHeaderInput extends IInput {
  properties: IHeader["properties"],
  format?: IHeader["format"],
  type: 'header'
}

export interface ISubHeaderInput extends IInput {
  properties: ISubHeader["properties"],
  format?: ISubHeader["format"],
  type: 'sub_header'
}

export interface ISubSubHeaderInput extends IInput {
  properties: ISubSubHeader["properties"],
  format?: ISubSubHeader["format"],
  type: 'sub_sub_header'
}

export interface INumberedListInput extends IInput {
  properties: INumberedList["properties"],
  format?: INumberedList["format"],
  type: 'numbered_list'
}

export interface IBulletedListInput extends IInput {
  properties: IBulletedList["properties"],
  format?: IBulletedList["format"],
  type: 'bulleted_list'
}

export interface IToggleInput extends IInput {
  properties: IToggle["properties"],
  format?: IToggle["format"],
  type: 'toggle'
}

export interface IQuoteInput extends IInput {
  properties: IQuote["properties"],
  format?: IQuote["format"],
  type: 'quote'
}

export interface ILinkToPageInput {
  type: "link_to_page",
  page_id: string,
}

export interface IDividerInput extends IInput {
  type: 'divider',
  properties?: IDivider["properties"],
  format?: IDivider["format"]
}

export interface ICalloutInput extends IInput{
  type: 'callout',
  format?: ICallout["format"]
  properties?: ICallout["properties"]
}

export interface ITodoInput extends IInput {
  type: 'to_do',
  properties: ITodo["properties"],
  format?: ITodo["format"]

}
// ? TD:2:M Add td for TCollectionBlockInput

export type TBasicBlockInput = ILinkToPageInput | IPageCreateInput | ITodoInput | ICalloutInput | IDividerInput | IQuoteInput | IToggleInput | IBulletedListInput | INumberedListInput | ISubSubHeaderInput | ISubHeaderInput | IHeaderInput | ITextInput;
// Advanced block input
export interface ITOCInput extends IInput {
  type: 'table_of_contents',
  format?: ITOC["format"],
  properties?: ITOC["properties"]
}

export interface IEquationInput extends IInput {
  type: 'equation',
  properties: IEquation["properties"],
  format?: IEquation["format"]
}

export interface IFactoryInput extends IInput {
  type: 'factory',
  properties: IFactory["properties"],
  format?: IFactory["format"],
  contents?: TBlockInput[]
}

export interface IBreadcrumbInput extends IInput {
  type: 'breadcrumb',
  properties?: IBreadcrumb["properties"],
  format?: IBreadcrumb["format"],
}

export type TAdvancedBlockInput = IBreadcrumbInput | IFactoryInput | IEquationInput | ITOCInput;

// Embed block input
export interface IEmbedInput extends IInput {
  type: "embed",
  properties: IEmbed["properties"],
  format?: IEmbed["format"],
}

export interface IDriveInput extends IInput {
  type: 'drive',
  properties?: IDrive["properties"],
  format?: IDrive["format"],
  file_id: string
}

export interface ITweetInput extends IInput {
  type: 'tweet',
  properties: ITweet["properties"],
  format?: ITweet["format"],
}

export interface ICodepenInput extends IInput {
  type: 'codepen',
  properties: ICodepen["properties"],
  format?: ICodepen["format"],
}

export interface IMapsInput extends IInput {
  type: 'maps',
  properties: IMaps["properties"],
  format?: IMaps["format"],
}

export interface IGistInput extends IInput {
  type: 'gist',
  properties: IGist["properties"],
  format?: IGist["format"],
}

export interface IFigmaInput extends IInput {
  type: 'figma',
  properties: IFigma["properties"],
  format?: IFigma["format"],
}

export type TEmbedBlockInput = IEmbedInput | IFigmaInput | IMapsInput | ICodepenInput | IDriveInput | IGistInput | ITweetInput;

export type TBlockInput = TMediaBlockInput | TBasicBlockInput | TAdvancedBlockInput | TEmbedBlockInput | TCollectionBlockInput | IColumnListInput;

export type RepositionParams = {
  id: string,
  position: "Before" | "After"
} | number | undefined;

export const TSpaceUpdateKeys = ["name", "icon", "disable_public_access", "disable_guests", "disable_move_to_space", "disable_export", "domain", "invite_link_enabled", "beta_enabled"] as const;
export const TCollectionUpdateKeys = ["name", "icon", "description"] as const;
export const TNotionUserUpdateKeys = ['family_name', 'given_name', 'profile_photo'] as const;
export const TSpaceViewUpdateKeys = ['notify_desktop', 'notify_email', 'notify_mobile', 'joined', 'created_getting_started'] as const;
export const TUserSettingsUpdateKeys = ['start_day_of_week', 'time_zone', 'locale', 'preferred_locale', 'preferred_locale_origin'] as const;

export type ISpaceUpdateInput = Partial<Pick<ISpace, ElementType<typeof TSpaceUpdateKeys>>>;
export type ISpaceCreateInput = Partial<Pick<ISpace, Exclude<ElementType<typeof TSpaceUpdateKeys>, "name" | "domain">>> & {name: string, contents: TBlockCreateInput[]};

export type ICollectionUpdateInput = Partial<Pick<ICollection, ElementType<typeof TCollectionUpdateKeys>>>;

export type INotionUserUpdateInput = Partial<Pick<INotionUser, ElementType<typeof TNotionUserUpdateKeys>>>;

export type ISpaceViewUpdateInput = Partial<Pick<ISpaceView, ElementType<typeof TSpaceViewUpdateKeys>>>;

export type IUserSettingsUpdateInput = Partial<Pick<IUserSettingsSettings, ElementType<typeof TUserSettingsUpdateKeys>>>;

export type TBlockCreateInput = TBlockInput & {
  position?: RepositionParams
}