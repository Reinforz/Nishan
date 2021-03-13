import { v4 } from 'uuid';
import { NotionIdz } from '../../libs';

it(`Should generate random id when none provided`, () => {
	expect(NotionIdz.Generate.id()).toBeTruthy();
});

it(`Should return passed id when correct uuid is provided`, () => {
	expect(NotionIdz.Generate.id(v4())).toBeTruthy();
});

it(`Should return passed id when correct id is provided`, () => {
	expect(NotionIdz.Generate.id(NotionIdz.Transform.toId(v4()))).toBeTruthy();
});

it(`Should generate random id when correct id is not provided`, () => {
	const consoleLogMock = jest.spyOn(console, 'log');
	const generated_id = NotionIdz.Generate.id(v4().slice(1));
	expect(generated_id).toBeTruthy();
	expect(consoleLogMock).toHaveBeenCalledWith('Invalid uuid provided');
	expect(consoleLogMock).toHaveBeenCalledTimes(1);
});
