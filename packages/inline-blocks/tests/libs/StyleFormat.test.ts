import { StyleFormatter } from '../../libs';

it(`strikethrough`, () => {
	const style_formatter = new StyleFormatter([ [ 'strikethrough' ] ]);
	expect(style_formatter.strikeThrough.content).toStrictEqual([ [ 'strikethrough', [ [ 's' ] ] ] ]);
});

it(`code`, () => {
	const style_formatter = new StyleFormatter([ [ 'code' ] ]);
	expect(style_formatter.code.content).toStrictEqual([ [ 'code', [ [ 'c' ] ] ] ]);
});

it(`bold`, () => {
	const style_formatter = new StyleFormatter([ [ 'bold' ] ]);
	expect(style_formatter.bold.content).toStrictEqual([ [ 'bold', [ [ 'b' ] ] ] ]);
});

it(`italic`, () => {
	const style_formatter = new StyleFormatter([ [ 'italic' ] ]);
	expect(style_formatter.italic.content).toStrictEqual([ [ 'italic', [ [ 'i' ] ] ] ]);
});

it(`underline`, () => {
	const style_formatter = new StyleFormatter([ [ 'underline' ] ]);
	expect(style_formatter.underline.content).toStrictEqual([ [ 'underline', [ [ '_' ] ] ] ]);
});

it(`highlight`, () => {
	const style_formatter = new StyleFormatter([ [ 'highlight' ] ]);
	expect(style_formatter.highlight('blue').content).toStrictEqual([ [ 'highlight', [ [ 'h', 'blue' ] ] ] ]);
});

it(`linkTo`, () => {
	const style_formatter = new StyleFormatter([ [ 'linkTo' ] ]);
	expect(style_formatter.linkTo('https://google.com').content).toStrictEqual([
		[ 'linkTo', [ [ 'a', 'https://google.com' ] ] ]
	]);
});
