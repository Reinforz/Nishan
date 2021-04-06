import { NotionCore } from '@nishans/core';

export default async function pageCommand (argv: any){
  const method = argv._[3];

  const nishan = new NotionCore.Api.Nishan({
    token: process.env.NISHAN_TOKEN_V2 as string,
    interval: parseInt(process.env.NISHAN_REQUEST_INTERVAL as string ?? '0') as number,
    logger: argv.verbose ?? false
  });

  const notion_user = await nishan.getNotionUser(process.env.NISHAN_NOTION_USER_ID);
  const space = await notion_user.getSpace(process.env.NISHAN_NOTION_SPACE_ID);

  if(method === "get"){
    const identifier = argv.id ?? argv.title;
    const {page} = await space.getRootPage((page)=>{
      if(argv.id) return page.type === "page" && page.id === argv.id;
      else if(argv.title) return page.type === "page" && page.properties.title[0][0] === argv.title;
    });
    const target_page = page.get(identifier);
    if(target_page)
      console.log(JSON.stringify(target_page.getCachedData(), null, 2));
  } else if (method === "create"){
    await space.createRootPages([
      {
        type: "page",
        contents: [],
        properties: {
          title: [[argv.title]]
        }
      }
    ])
  } else if (method === "update"){
    await space.updateRootPage((page)=>{
      if(argv.id) return page.type === "page" && page.id === argv.id ? {type: "page", properties: {
        title: [[argv.newTitle]]
      }} : undefined;
      else if(argv.title) return page.type === "page" && page.properties.title[0][0] === argv.title ? {type: "page", properties: {
        title: [[argv.newTitle]]
      }} : undefined;
    })
  } else if (method === "delete"){
    await space.deleteRootPage((page)=>{
      if(argv.id) return page.type === "page" && page.id === argv.id;
      else if(argv.title) return page.type === "page" && page.properties.title[0][0] === argv.title;
    })
  }
}