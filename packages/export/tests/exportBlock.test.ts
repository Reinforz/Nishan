import { NotionEndpoints } from '@nishans/endpoints';
import { NotionIdz } from '@nishans/idz';
import { NotionExport } from "../libs";

it(`exportBlock`, async () => {
	const block_id = NotionIdz.Generate.id(), enqueueTaskMock = jest
			.spyOn(NotionEndpoints.Mutations, 'enqueueTask')
			.mockImplementationOnce(async () => ({ taskId: '123' })),
		getTasksMock = jest.spyOn(NotionEndpoints.Queries, 'getTasks').mockImplementationOnce(async () => ({results: [
			{
				eventName: 'exportBlock',
				state: 'in_progress',
			}
		] as any})).mockImplementationOnce(async () => ({results: [
			{
				eventName: 'exportBlock',
				state: 'success',
				status: {
					exportURL: 'exportUrl'
				}
			}
		] as any}));
  const export_options = {
    exportType: 'html',
    locale: 'en',
    timeZone: 'Asia/Dhaka'
  } as const;
  const export_url = await NotionExport.block(block_id, {
    ...export_options,
    recursive: true,
  }, {
    token: 'token',
    user_id: 'user_1',
  });

  expect(export_url).toBe('exportUrl');
  expect(enqueueTaskMock.mock.calls[0][0]).toStrictEqual({
    task: {
      eventName: 'exportBlock',
      request: {
        exportOptions: expect.objectContaining(export_options),
        blockId: block_id,
        recursive: true
      }
    }
  });
  expect(getTasksMock).toHaveBeenCalledTimes(2);
  expect(getTasksMock.mock.calls[0][0]).toStrictEqual({taskIds: [
    '123'
  ]})
});
