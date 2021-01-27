import { inlineText } from '../src';

function createInlineTextFormatterSnapshot (formatter: string) {
	return `
  Array [
    Array [
      "text",
      Array [
        Array [
          "${formatter}",
        ],
      ],
    ],
  ]
`;
}

describe('Should create correct formatting', () => {
	it('Should support empty text', () => {
		expect(inlineText().text).toMatchInlineSnapshot(`Array []`);
	});

	it('Should support strikethrough formatting', () => {
		expect(inlineText('text').strikeThrough.text).toMatchInlineSnapshot(createInlineTextFormatterSnapshot('s'));
	});

	it('Should support code formatting', () => {
		expect(inlineText('text').code.text).toMatchInlineSnapshot(createInlineTextFormatterSnapshot('c'));
	});

	it('Should support bold formatting', () => {
		expect(inlineText('text').bold.text).toMatchInlineSnapshot(createInlineTextFormatterSnapshot('b'));
	});

	it('Should support italic formatting', () => {
		expect(inlineText('text').italic.text).toMatchInlineSnapshot(createInlineTextFormatterSnapshot('i'));
	});

	it('Should support underline formatting', () => {
		expect(inlineText('text').underline.text).toMatchInlineSnapshot(createInlineTextFormatterSnapshot('_'));
	});
});
