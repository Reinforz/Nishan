import { TTextFormat } from '@nishans/types';
import { inlineText } from '../src';

function testAfterStringifying (source: TTextFormat, format: string[]) {
	expect(JSON.stringify(source)).toBe(`[["text",[[${format.map((format) => `"${format}"`).join(',')}]]]]`);
}

describe('Should create correct formatting', () => {
	it('Should support empty text', () => {
		expect(JSON.stringify(inlineText().text)).toBe(`[]`);
	});

	it('Should support strikethrough formatting', () => {
		testAfterStringifying(inlineText('text').strikeThrough.text, [ 's' ]);
	});

	it('Should support code formatting', () => {
		testAfterStringifying(inlineText('text').code.text, [ 'c' ]);
	});

	it('Should support bold formatting', () => {
		testAfterStringifying(inlineText('text').bold.text, [ 'b' ]);
	});

	it('Should support italic formatting', () => {
		testAfterStringifying(inlineText('text').italic.text, [ 'i' ]);
	});

	it('Should support underline formatting', () => {
		testAfterStringifying(inlineText('text').underline.text, [ '_' ]);
	});

	it('Should support highlight formatting', () => {
		testAfterStringifying(inlineText('text').highlight('red').text, [ 'h', 'red' ]);
	});

	it('Should support link formatting', () => {
		testAfterStringifying(inlineText('text').linkTo('www.google.com').text, [ 'a', 'www.google.com' ]);
	});
});
