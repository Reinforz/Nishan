import { ISpace } from "./api";
import { Node, FormatBlockColor, TCodeLanguage, Block, TPermissionRole, Permission, ParentProps, Schema } from "./types";

export interface PageProps {
  title: string[][],
  [k: string]: string[][]
}

export interface PageFormat {
  page_icon: string,
  page_font: string,
  page_full_width: boolean,
  page_small_text: boolean,
  block_locked_by: string,
  block_locked: boolean,
  page_cover: string,
  page_cover_position: number,
  block_color?: FormatBlockColor
}

export interface MediaProps {
  source: string[][],
  caption?: string[][]
}

export interface MediaFormat {
  block_aspect_ratio?: number,
  block_full_width?: boolean,
  block_page_width?: boolean,
  block_preserve_scale?: boolean,
  block_width?: number,
  display_source: string
}

export interface WebBookmarkFormat {
  bookmark_cover: string,
  bookmark_icon: string,
  block_color?: FormatBlockColor
}

export interface WebBookmarkProps {
  link: string[][],
  description: string[][],
  title: string[][],
  caption?: string[][]
}

export interface CodeFormat {
  code_wrap: boolean
}

export interface CodeProps {
  title: string[][],
  language: TCodeLanguage
}

export interface FileProps {
  title: string[][],
  source: string[][],
  caption?: string[][]
}

export interface FileFormat {
  block_color?: FormatBlockColor
}

export interface TodoProps {
  title: string[][],
  checked: ("Yes" | "No")[][]
}
// -----------------

// Media Block Input
export interface IMediaInput {
  properties: MediaProps,
  format: MediaFormat,
  file_ids: string[]
}

export interface IVideoInput extends IMediaInput {
  type: 'video',
}

export interface IImageInput extends IMediaInput {
  type: 'image',
}

export interface IAudioInput extends IMediaInput {
  type: 'audio',
}

export interface IWebBookmarkInput {
  type: 'bookmark',
  properties: WebBookmarkProps,
  format: WebBookmarkFormat
}

// Basic block input
export interface ICodeInput {
  type: 'code',
  properties: CodeProps,
  format: CodeFormat
}

export interface IFileInput {
  type: 'file',
  properties: FileProps,
  format: FileFormat
}

export type TMediaBlockInput = IVideoInput | IImageInput | IAudioInput | IWebBookmarkInput | ICodeInput | IFileInput;

// Basic Block Input

export interface IPageInput {
  type: 'page',
  properties: PageProps,
  format: PageFormat
}

export interface ICommonTextInput {
  properties: {
    title: string[][]
  },
  format: {
    block_color?: FormatBlockColor
  }
}

export interface ITextInput extends ICommonTextInput {
  type: 'text'
}

export interface IHeaderInput extends ICommonTextInput {
  type: 'header'
}

export interface ISubHeaderInput extends ICommonTextInput {
  type: 'sub_header'
}

export interface ISubSubHeaderInput extends ICommonTextInput {
  type: 'sub_sub_header'
}

export interface INumberedListInput extends ICommonTextInput {
  type: 'numbered_list'
}

export interface IBulletedListInput extends ICommonTextInput {
  type: 'bulleted_list'
}

export interface IToggleInput extends ICommonTextInput {
  type: 'toggle'
}

export interface IQuoteInput extends ICommonTextInput {
  type: 'quote'
}

export interface IDividerInput {
  type: 'divider',
  properties?: {},
  format?: {}
}

export interface ICalloutInput extends ICommonTextInput {
  type: 'callout',
  format: {
    page_icon: string,
    block_color?: FormatBlockColor
  }
}

export interface ITodoInput {
  type: 'to_do',
  properties: TodoProps,
  format: {
    block_color?: FormatBlockColor
  }
}

export type TBasicBlockInput = IPageInput | ITodoInput | ICalloutInput | IDividerInput | IQuoteInput | IToggleInput | IBulletedListInput | INumberedListInput | ISubSubHeaderInput | ISubHeaderInput | IHeaderInput | ITextInput;
// Advanced block input
export interface ITOCInput {
  type: 'table_of_contents',
  format: {
    block_color?: FormatBlockColor
  },
  properties?: {}
}

export interface IEquationInput {
  type: 'equation',
  properties: {
    title: string[][]
  },
  format: {
    block_color?: FormatBlockColor
  }
}

export interface IFactoryInput {
  type: 'factory',
  properties: {
    title: string[][]
  },
  format: {
    block_color?: FormatBlockColor
  },
  contents: TBlockInput[]
}

export interface IBreadcrumbInput {
  type: 'breadcrumb',
  properties?: {},
  format: {},
}

export type TAdvancedBlockInput = IBreadcrumbInput | IFactoryInput | IEquationInput | ITOCInput;

// Embed block input
export interface IDriveInput {
  type: 'drive',
  properties?: {},
  format?: {},
}

export interface ITweetInput {
  type: 'tweet',
  properties: {
    source: string[][]
  },
  format?: {},
}

export interface ICodepenInput {
  type: 'codepen',
  properties: {
    source: string[][]
  },
  format: MediaFormat,
}

export interface IMapsInput {
  type: 'maps',
  properties: {
    source: string[][]
  },
  format: MediaFormat,
}

export interface IGistInput {
  type: 'gist',
  properties: {
    source: string[][]
  },
  format?: {
    block_color?: FormatBlockColor,
    display_source: null
  },
}

export interface IFigmaInput {
  type: 'figma',
  properties: {
    source: string[][]
  },
  format: MediaFormat,
}

export type TEmbedBlockInput = IFigmaInput | IMapsInput | ICodepenInput | IDriveInput | IGistInput | ITweetInput;

export type TBlockInput = TMediaBlockInput | TBasicBlockInput | TAdvancedBlockInput | TEmbedBlockInput;
// -----------------

export interface IPublicPermission {
  type: 'public_permission',
  role: TPermissionRole,
  allow_duplicate: boolean
}

// Media Block Types
export interface IVideo extends Block, IVideoInput { };
export interface IAudio extends Block, IAudioInput { };
export interface IImage extends Block, IImageInput { };
export interface IWebBookmark extends Block, IWebBookmarkInput { };
export interface ICode extends Block, ICodeInput { };
export interface IFile extends Block, IFileInput { };

export type TMediaBlock = IVideo | IAudio | IImage | IWebBookmark | ICode | IFile;

// Basic Block Types
export interface IPage extends Block {
  properties: PageProps,
  type: 'page',
  content: string[],
  format: PageFormat,
  is_template?: boolean,
  file_ids?: string[]
}

export interface IRootPage extends IPage {
  permissions: (Permission | IPublicPermission)[]
}

export interface ICollectionBlock extends Block {
  view_ids: string[],
  collection_id: string,
  type: 'collection_view' | 'collection_view_page'
}

export interface ICollectionView extends ICollectionBlock {
  type: 'collection_view',
}

export interface ICollectionViewPage extends ICollectionBlock {
  type: 'collection_view_page',
}

export type TCollectionBlock = ICollectionView | ICollectionViewPage;

export interface IText extends ITextInput, Block { }
export interface ITodo extends ITodoInput, Block { }
export interface IHeader extends IHeaderInput, Block { }
export interface ISubHeader extends ISubHeaderInput, Block { }
export interface ISubSubHeader extends ISubSubHeaderInput, Block { }
export interface IBulletedList extends IBulletedListInput, Block { }
export interface INumberedList extends INumberedListInput, Block { }
export interface IToggle extends IToggleInput, Block { }
export interface IQuote extends IQuoteInput, Block { }
export interface IDivider extends IDividerInput, Block { }
export interface ICallout extends ICalloutInput, Block { }

export type TBasicBlock = IText | ITodo | IHeader | ISubHeader | ISubSubHeader | IBulletedList | INumberedList | IToggle | IQuote | IDivider | ICallout | IPage | IRootPage | TCollectionBlock;

// Advanced block types
export interface ITOC extends ITOCInput, Block { };
export interface IEquation extends IEquationInput, Block { };
export interface IBreadcrumb extends IBreadcrumbInput, Block { };
export interface IFactory extends Block {
  type: 'factory',
  properties: {
    title: string[][]
  },
  format: {
    block_color?: FormatBlockColor
  },
  contents: string[]
}

export type TAdvancedBlock = ITOC | IEquation | IBreadcrumb | IFactory;

// Embeds Type
export interface IGist extends Block, IGistInput { }
export interface IDrive extends Block, IDriveInput {
  format: {
    drive_properties: {
      file_id: string,
      icon: string,
      modified_time: number,
      title: string,
      trashed: boolean,
      url: string,
      user_name: string,
    },
    drive_status: {
      authed: boolean,
      last_fetched: number
    }
  }
}
export interface ITweet extends Block, ITweetInput { }
export interface ICodepen extends Block, ICodepenInput { }
export interface IMaps extends Block, IMapsInput { }
export interface IFigma extends Block, IFigmaInput { }

export type TEmbedBlock = ITweet | ICodepen | IMaps | IFigma | IDrive | IGist;

export type TBlock = TBasicBlock | TMediaBlock | TAdvancedBlock | TEmbedBlock;

export type TParentType = IRootPage | ISpace;

export interface ICollection extends Node, ParentProps {
  description: string[][],
  icon?: string,
  migrated: boolean,
  name: string[][],
  schema: Schema,
  template_pages?: string[]
}
