import { TTextFormat } from '@nishans/types';
import { inlineEquation, inlineMention, inlinePage, inlineText } from '../src';

function testAfterStringifying (source: TTextFormat, text: string, format: string[]) {
	expect(JSON.stringify(source)).toBe(`[["${text}",[[${format.map((format) => `"${format}"`).join(',')}]]]]`);
}

describe('Should create correct formatting', () => {
	it('Should support empty text', () => {
		expect(JSON.stringify(inlineText().text)).toBe(`[]`);
	});

	it('Should support strikethrough formatting', () => {
		testAfterStringifying(inlineText('text').strikeThrough.text, 'text', [ 's' ]);
	});

	it('Should support code formatting', () => {
		testAfterStringifying(inlineText('text').code.text, 'text', [ 'c' ]);
	});

	it('Should support bold formatting', () => {
		testAfterStringifying(inlineText('text').bold.text, 'text', [ 'b' ]);
	});

	it('Should support italic formatting', () => {
		testAfterStringifying(inlineText('text').italic.text, 'text', [ 'i' ]);
	});

	it('Should support underline formatting', () => {
		testAfterStringifying(inlineText('text').underline.text, 'text', [ '_' ]);
	});

	it('Should support highlight formatting', () => {
		testAfterStringifying(inlineText('text').highlight('red').text, 'text', [ 'h', 'red' ]);
	});

	it('Should support link formatting', () => {
		testAfterStringifying(inlineText('text').linkTo('www.google.com').text, 'text', [ 'a', 'www.google.com' ]);
	});
});

describe('Should create correct color highlight formatting', () => {
	it('Should support default highlight formatting', () => {
		testAfterStringifying(inlineText('text').default.text, 'text', [ 'h', 'default' ]);
	});

	it('Should support gray highlight formatting', () => {
		testAfterStringifying(inlineText('text').gray.text, 'text', [ 'h', 'gray' ]);
	});

	it('Should support brown highlight formatting', () => {
		testAfterStringifying(inlineText('text').brown.text, 'text', [ 'h', 'brown' ]);
	});

	it('Should support orange highlight formatting', () => {
		testAfterStringifying(inlineText('text').orange.text, 'text', [ 'h', 'orange' ]);
	});

	it('Should support yellow highlight formatting', () => {
		testAfterStringifying(inlineText('text').yellow.text, 'text', [ 'h', 'yellow' ]);
	});

	it('Should support teal highlight formatting', () => {
		testAfterStringifying(inlineText('text').teal.text, 'text', [ 'h', 'teal' ]);
	});

	it('Should support blue highlight formatting', () => {
		testAfterStringifying(inlineText('text').blue.text, 'text', [ 'h', 'blue' ]);
	});

	it('Should support purple highlight formatting', () => {
		testAfterStringifying(inlineText('text').purple.text, 'text', [ 'h', 'purple' ]);
	});

	it('Should support pink highlight formatting', () => {
		testAfterStringifying(inlineText('text').pink.text, 'text', [ 'h', 'pink' ]);
	});

	it('Should support red highlight formatting', () => {
		testAfterStringifying(inlineText('text').red.text, 'text', [ 'h', 'red' ]);
	});
});

describe('Should create correct background highlight formatting', () => {
	it('Should support default background highlight formatting', () => {
		testAfterStringifying(inlineText('text').defaultbg.text, 'text', [ 'h', 'default_background' ]);
	});

	it('Should support gray background highlight formatting', () => {
		testAfterStringifying(inlineText('text').graybg.text, 'text', [ 'h', 'gray_background' ]);
	});

	it('Should support brown background highlight formatting', () => {
		testAfterStringifying(inlineText('text').brownbg.text, 'text', [ 'h', 'brown_background' ]);
	});

	it('Should support orange background highlight formatting', () => {
		testAfterStringifying(inlineText('text').orangebg.text, 'text', [ 'h', 'orange_background' ]);
	});

	it('Should support yellow background highlight formatting', () => {
		testAfterStringifying(inlineText('text').yellowbg.text, 'text', [ 'h', 'yellow_background' ]);
	});

	it('Should support teal background highlight formatting', () => {
		testAfterStringifying(inlineText('text').tealbg.text, 'text', [ 'h', 'teal_background' ]);
	});

	it('Should support blue background highlight formatting', () => {
		testAfterStringifying(inlineText('text').bluebg.text, 'text', [ 'h', 'blue_background' ]);
	});

	it('Should support purple background highlight formatting', () => {
		testAfterStringifying(inlineText('text').purplebg.text, 'text', [ 'h', 'purple_background' ]);
	});

	it('Should support pink background highlight formatting', () => {
		testAfterStringifying(inlineText('text').pinkbg.text, 'text', [ 'h', 'pink_background' ]);
	});

	it('Should support red background highlight formatting', () => {
		testAfterStringifying(inlineText('text').redbg.text, 'text', [ 'h', 'red_background' ]);
	});
});

it('pushToLast method should work correctly', () => {
	testAfterStringifying(inlineText('text').pushToLast([ 'h', 'red' ]).text, 'text', [ 'h', 'red' ]);
	testAfterStringifying(inlineText('text').pushToLast([ 'c' ]).text, 'text', [ 'c' ]);
});

describe('Other inline block functions should work correctly', () => {
	testAfterStringifying(inlineMention('123').text, '‣', [ 'u', '123' ]);
	testAfterStringifying(inlinePage('123').text, '‣', [ 'p', '123' ]);
	testAfterStringifying(inlineEquation('123').text, '⁍', [ 'e', '123' ]);
});
