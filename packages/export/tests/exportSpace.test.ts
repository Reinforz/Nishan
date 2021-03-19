import { NotionEndpoints } from '@nishans/endpoints';
import { NotionIdz } from '@nishans/idz';
import { NotionExport } from "../libs";

it(`exportSpace`, async () => {
	const space_id = NotionIdz.Generate.id(), enqueueTaskMock = jest
			.spyOn(NotionEndpoints.Mutations, 'enqueueTask')
			.mockImplementationOnce(async () => ({ taskId: '123' })),
		getTasksMock = jest.spyOn(NotionEndpoints.Queries, 'getTasks').mockImplementationOnce(async () => ({results: [
			{
				eventName: 'exportSpace',
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
  const export_url = await NotionExport.space(space_id, export_options, {
    token: 'token',
    user_id: 'user_1',
  });

  expect(export_url).toBe('exportUrl');
  expect(enqueueTaskMock.mock.calls[0][0]).toStrictEqual({
    task: {
      eventName: 'exportSpace',
      request: {
        exportOptions: expect.objectContaining(export_options),
        spaceId: space_id,
      }
    }
  });
  expect(getTasksMock).toHaveBeenCalledTimes(1);
  expect(getTasksMock.mock.calls[0][0]).toStrictEqual({taskIds: [
    '123'
  ]})
});
