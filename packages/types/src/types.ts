import {
	ISpace,
	ISpaceView,
	INotionUser,
	IUserSettings,
	IUserRoot,
	RecordMap,
	ICollection,
	ICollectionViewPage,
	IPage,
	TBlock,
	TView
} from '.';

export type Args = any /* string | { value: ValueArg } | { schema: Schema } | string[][] | number */;

export type TLocale = 'en-US' | 'ko-KR';
export type TPage = IPage | ICollectionViewPage;
export type TCodeLanguage =
	| 'ABAP'
	| 'Arduino'
	| 'Bash'
	| 'BASIC'
	| 'C'
	| 'Clojure'
	| 'CoffeeScript'
	| 'C++'
	| 'C#'
	| 'CSS'
	| 'Dart'
	| 'Diff'
	| 'Docker'
	| 'Elixir'
	| 'Elm'
	| 'Erlang'
	| 'Flow'
	| 'Fortran'
	| 'F#'
	| 'Gherkin'
	| 'GLSL'
	| 'Go'
	| 'GraphQL'
	| 'Groovy'
	| 'Haskell'
	| 'HTML'
	| 'Java'
	| 'JavaScript'
	| 'JSON'
	| 'Kotlin'
	| 'LaTeX'
	| 'Less'
	| 'Lisp'
	| 'LiveScript'
	| 'Lua'
	| 'Makefile'
	| 'Markdown'
	| 'Markup'
	| 'MATLAB'
	| 'Nix'
	| 'Objective-C'
	| 'OCaml'
	| 'Pascal'
	| 'Perl'
	| 'PHP'
	| 'Plain Text'
	| 'PowerShell'
	| 'Prolog'
	| 'Python'
	| 'R'
	| 'Reason'
	| 'Ruby'
	| 'Rust'
	| 'Sass'
	| 'Scala'
	| 'Scheme'
	| 'Scss'
	| 'Shell'
	| 'SQL'
	| 'Swift'
	| 'TypeScript'
	| 'VB.Net'
	| 'Verilog'
	| 'VHDL'
	| 'Visual Basic'
	| 'WebAssembly'
	| 'XML'
	| 'YAML';
export type TDataType = keyof RecordMap;
export type TPlanType = 'personal';
export type TCollectionViewBlock = 'collection_view' | 'collection_view_page';
export type TSortValue = 'ascending' | 'descending';

export type TData = TBlock | ICollection | TView | ISpace | INotionUser | ISpaceView | IUserRoot | IUserSettings;
