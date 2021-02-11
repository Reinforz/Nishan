import { ITPage, Collection, Space } from "../src";
import {nishan, TEST_DATA} from "./constants"

let space: Space = null as any;

beforeAll(async ()=>{
  const user = await nishan.getNotionUser(TEST_DATA.notion_user[0].data.id);
  space = await user.getSpace(TEST_DATA.space[0].data.id);
  space.init_cache = true;
})

function checkRootPages(pages: ITPage, status?:boolean){
  status = status ?? true;
  if(status){
    expect(pages.page.size).toBe(2);
    expect(pages.page.get(TEST_DATA.block.page[0].data.id)).not.toBeNull();
    expect(pages.page.get(TEST_DATA.block.page[0].data.id)?.id).toBe(TEST_DATA.block.page[0].data.id);
    expect(pages.page.get(TEST_DATA.block.page[0].data.id)?.type).toBe("block");
  }else{
    expect(pages.page.size).toBe(0);
    expect(pages.page.get(TEST_DATA.block.page[0].data.id)).toBeUndefined();
  }
}

function checkRootCollectionViewPages(pages: ITPage, status?:boolean){
  status = status ?? true;
  if(status){
    expect(pages.collection_view_page.size).toBe(2);
    expect(pages.collection_view_page.get(TEST_DATA.block.collection_view_page[0].data.id)).not.toBeNull();
    expect(pages.collection_view_page.get(TEST_DATA.block.collection_view_page[0].data.id)?.id).toBe(TEST_DATA.block.collection_view_page[0].data.id);
    expect(pages.collection_view_page.get(TEST_DATA.block.collection_view_page[0].data.id)?.type).toBe("block");
  }else{
    expect(pages.collection_view_page.size).toBe(0);
    expect(pages.collection_view_page.get(TEST_DATA.block.collection_view_page[0].data.id)).toBeUndefined();
  }
}

function checkRootCollection(collection: Collection, status?:boolean){
  status = status ?? true;
  if(status){
    expect(collection).not.toBeNull();
    expect(collection.id).toBe(TEST_DATA.collection[0].data.id);
  }else{
    expect(collection).toBeUndefined();
  }
}

// function keyValueChecker<T extends TData>(data: T, args: Partial<Record<keyof T, string | number | boolean>>){
//   Object.keys(args).forEach(key=>expect(data[key as keyof T]).toBe(args[key as keyof T]))
// }

// function testUpdateMethod<T>({cb, child_id, child_type = "block", parent_id, parent_type}: {
//   child_id: string,
//   child_type?: TDataType,
//   parent_id?: string,
//   parent_type?: TDataType,
//   cb: (data: T) => void
// }){
//   const {stack} = space, check_parent = parent_id && parent_type;
//   expect(stack.length).toBe(2);
//   const [child_op, parent_op] = stack;

//   cb(child_op.args as T)

//   expect(child_op.id).toBe(child_id)    
//   expect(child_op.command).toBe("update");
//   expect(child_op.table).toBe(child_type);
//   expect(child_op.path.length).toBe(0);
//   expect(child_op.args.last_edited_by_id).toBe(TEST_DATA.notion_user[0].data.id);
//   expect(child_op.args.last_edited_by_table).toBe("notion_user");
//   expect(child_op.args.last_edited_time).toBeLessThanOrEqual(Date.now());

//   if(check_parent && parent_op){
//     expect(parent_op.id).toBe(parent_id); 
//     expect(parent_op.command).toBe("update");
//     expect(parent_op.table).toBe(parent_type);
//     expect(parent_op.path.length).toBe(0);
//     expect(parent_op.args.last_edited_by_id).toBe(TEST_DATA.notion_user[0].data.id);
//     expect(parent_op.args.last_edited_by_table).toBe("notion_user");
//     expect(parent_op.args.last_edited_time).toBeLessThanOrEqual(Date.now());
//   }
// }

// function testDeleteMethod<P extends TData>({child_path, child_id, child_type = "block", parent_id, parent_type}: {
//   child_id: string,
//   child_type?: TDataType,
//   parent_id?: string,
//   parent_type?: TDataType,
//   child_path: keyof P,
// }){
//   const {stack} = space, check_parent = parent_id && parent_type;
//   console.log(stack);
//   expect(stack.length).toBe(3);
//   const [child_op, parent_path_op, parent_op] = stack;

//   expect(child_op.id).toBe(child_id)    
//   expect(child_op.command).toBe("update");
//   expect(child_op.table).toBe(child_type);
//   expect(child_op.path.length).toBe(0);
//   expect(child_op.args.alive).toBe(false);
//   expect(child_op.args.last_edited_by_id).toBe(TEST_DATA.notion_user[0].data.id);
//   expect(child_op.args.last_edited_by_table).toBe("notion_user");
//   expect(child_op.args.last_edited_time).toBeLessThanOrEqual(Date.now());

//   expect(parent_path_op.path[0]).toBe(child_path)
//   expect(parent_path_op.command).toBe('listRemove')
//   expect(parent_path_op.table).toBe(parent_type);
//   expect(parent_path_op.id).toBe(parent_id);
//   expect(parent_path_op.args.id).toBe(child_id);

//   if(check_parent && parent_op){
//     expect(parent_op.id).toBe(parent_id); 
//     expect(parent_op.command).toBe("update");
//     expect(parent_op.table).toBe(parent_type);
//     expect(parent_op.path.length).toBe(0);
//     expect(parent_op.args.last_edited_by_id).toBe(TEST_DATA.notion_user[0].data.id);
//     expect(parent_op.args.last_edited_by_table).toBe("notion_user");
//     expect(parent_op.args.last_edited_time).toBeLessThanOrEqual(Date.now());
//   }
// }

describe("Getter methods for space", ()=>{
  it("Get root collection ids",()=>{
    const collection_ids = space.getRootCollectionIds();
    expect(collection_ids.length).toBe(1);
    expect(collection_ids[0]).toBe(TEST_DATA.collection[0].data.id);
  })

  it("Get space_view",()=>{
    const space_view = space.getSpaceView();
    expect(space_view.id).toBe(TEST_DATA.space_view[0].data.id);
  })
  
  it("Get collection id", async ()=>{
    checkRootCollection(await space.getRootCollection(TEST_DATA.collection[0].data.id))
  })
  
  it("!Get collection !id", async ()=>{
    checkRootCollection(await space.getRootCollection(TEST_DATA.collection[0].data.id.slice(1)), false)
  })
  
  it("Get [collection] [id]", async ()=>{
    checkRootCollection((await space.getRootCollections([TEST_DATA.collection[0].data.id]))[0]);
  })
  
  it("!Get [collection] ![id]", async ()=>{
    checkRootCollection((await space.getRootCollections([TEST_DATA.collection[0].data.id.slice(1)]))[0], false);
  })
  
  it("Get collection cb", async ()=>{
    checkRootCollection(await space.getRootCollection(collection=>collection.id === TEST_DATA.collection[0].data.id));
  })
  
  it("!Get collection !cb", async ()=>{
    checkRootCollection(await space.getRootCollection(collection=>collection.id === TEST_DATA.collection[0].data.id.slice(1)), false);
  })
  
  it("Get [collection] cb.id", async ()=>{
    checkRootCollection((await space.getRootCollections(collection=>collection.id === TEST_DATA.collection[0].data.id))[0]);
  })
  
  it("Get [collection] cb.parent_id", async ()=>{
    checkRootCollection((await space.getRootCollections(collection=>collection.parent_id === TEST_DATA.block.collection_view_page[0].data.id))[0]);
  })
  
  it("!Get [collection] !cb", async ()=>{
    checkRootCollection((await space.getRootCollections(collection=>collection.id === TEST_DATA.collection[0].data.id.slice(1)))[0], false);
  })
  
  it("Get root_page id", async ()=>{
    checkRootPages(await space.getTRootPage(TEST_DATA.block.page[0].data.id))
  })
  
  it("!Get root_page !id", async ()=>{
    checkRootPages(await space.getTRootPage(TEST_DATA.block.page[0].data.id.slice(1)), false)
  })
  
  it("Get [root_page] [id]", async ()=>{
    checkRootPages(await space.getTRootPages([TEST_DATA.block.page[0].data.id]));
  })
  
  it("!Get [root_page] ![id]", async ()=>{
    checkRootPages(await space.getTRootPages([TEST_DATA.block.page[0].data.id.slice(1)]), false);
  })
  
  it("Get root_page cb", async ()=>{
    checkRootPages(await space.getTRootPage(root_page=>root_page.id === TEST_DATA.block.page[0].data.id));
  })
  
  it("!Get root_page !cb", async ()=>{
    checkRootPages(await space.getTRootPage(root_page=>root_page.id === TEST_DATA.block.page[0].data.id.slice(1)), false);
  })
  
  it("Get [root_page] cb.id", async ()=>{
    checkRootPages(await space.getTRootPages(root_page=>root_page.id === TEST_DATA.block.page[0].data.id));
  })
  
  it("Get [root_page] cb.type", async ()=>{
    checkRootPages(await space.getTRootPages(root_page=>root_page.type === "page"));
  })
  
  it("!Get [root_page] !cb", async ()=>{
    checkRootPages(await space.getTRootPages(root_page=>root_page.id === TEST_DATA.block.page[0].data.id.slice(1)), false);
  })
  
  
  it("Get root_cvp id", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPage(TEST_DATA.block.collection_view_page[0].data.id))
  })
  
  it("!Get root_cvp !id", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPage(TEST_DATA.block.collection_view_page[0].data.id.slice(1)), false)
  })
  
  it("Get [root_cvp] [id]", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPages([TEST_DATA.block.collection_view_page[0].data.id]));
  })
  
  it("!Get [root_cvp] ![id]", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPages([TEST_DATA.block.collection_view_page[0].data.id.slice(1)]), false);
  })
  
  it("Get root_cvp cb", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPage(root_cvp=>root_cvp.id === TEST_DATA.block.collection_view_page[0].data.id));
  })
  
  it("!Get root_cvp !cb", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPage(root_cvp=>root_cvp.id === TEST_DATA.block.collection_view_page[0].data.id.slice(1)), false);
  })
  
  it("Get [root_cvp] cb.id", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPages(root_cvp=>root_cvp.id === TEST_DATA.block.collection_view_page[0].data.id));
  })
  
  it("Get [root_cvp] cb.type", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPages(root_cvp=>root_cvp.type === "collection_view_page"));
  })
  
  it("!Get [root_cvp] !cb", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPages(root_cvp=>root_cvp.id === TEST_DATA.block.collection_view_page[0].data.id.slice(1)), false);
  })
})

// describe.skip("Update methods for space", ()=>{
//   beforeEach(()=>{
//     space.stack = [];
//   })

//   it("Update space", async ()=>{
//     const {stack} = space,
//     update_obj = {
//       beta_enabled: true,
//       disable_export: true
//     };
//     await space.update(update_obj);
//     expect(stack.length).not.toBe(0);
//     keyValueChecker<ISpace>(stack[0].args, update_obj);
//     keyValueChecker<ISpace>(space.getCachedData(), update_obj);
//   })

//   it("Update [root_page] [id]", async ()=>{
//     await space.updateRootPages([[TEST_DATA.block.page[0].data.id, {
//       format: {
//         page_icon: "icon"
//       }
//     }]]);
//     testUpdateMethod<IPageUpdateInput>({
//       child_id: TEST_DATA.block.page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       cb: (data) => expect(data?.format?.page_icon).toBe("icon")
//     });    
//   })

//   it("Update [root_page] cb", async ()=>{
//     await space.updateRootPages((page)=>page.type === "page" && page.id === TEST_DATA.block.page[0].data.id ? {
//       format: {
//         page_icon: "icon"
//       }
//     } : undefined)
//     testUpdateMethod<IPageUpdateInput>({
//       child_id: TEST_DATA.block.page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       cb: (data) => expect(data?.format?.page_icon).toBe("icon")
//     })
//   })

//   it("Update [root_cvp] [id]", async()=>{
//     await space.updateRootPages([[TEST_DATA.block.collection_view_page[0].data.id, {
//       format: {
//         page_icon: "icon"
//       }
//     }]]);
//     testUpdateMethod<ICollectionViewPageUpdateInput>({
//       child_id: TEST_DATA.block.collection_view_page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       cb: (data) => expect(data?.format?.page_icon).toBe("icon")
//     })
//   })

//   it("Update [root_cvp] cb", async()=>{
//     await space.updateRootPages(page=>page.type === "collection_view_page" && page.id === TEST_DATA.block.collection_view_page[0].data.id ? {
//       format: {
//         page_icon: "icon"
//       }
//     } : undefined);
//     testUpdateMethod<ICollectionViewPageUpdateInput>({
//       child_id: TEST_DATA.block.collection_view_page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       cb: (data) => expect(data?.format?.page_icon).toBe("icon")
//     })
//   })

//   it("Update root_page id", async ()=>{
//     await space.updateRootPage([TEST_DATA.block.page[0].data.id, {
//       format: {
//         page_icon: "icon"
//       }
//     }]);
//     testUpdateMethod<IPageUpdateInput>({
//       child_id: TEST_DATA.block.page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       cb: (data) => expect(data?.format?.page_icon).toBe("icon")
//     });    
//   })

//   it("Update root_page cb", async ()=>{
//     await space.updateRootPage((page)=>page.type === "page" && page.id === TEST_DATA.block.page[0].data.id ? {
//       format: {
//         page_icon: "icon"
//       }
//     } : undefined)
//     testUpdateMethod<IPageUpdateInput>({
//       child_id: TEST_DATA.block.page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       cb: (data) => expect(data?.format?.page_icon).toBe("icon")
//     })
//   })

//   it("Update root_cvp id", async()=>{
//     await space.updateRootPage([TEST_DATA.block.collection_view_page[0].data.id, {
//       format: {
//         page_icon: "icon"
//       }
//     }]);
//     testUpdateMethod<ICollectionViewPageUpdateInput>({
//       child_id: TEST_DATA.block.collection_view_page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       cb: (data) => expect(data?.format?.page_icon).toBe("icon")
//     })
//   })

//   it("Update root_cvp cb", async()=>{
//     await space.updateRootPage(page=>page.type === "collection_view_page" && page.id === TEST_DATA.block.collection_view_page[0].data.id ? {
//       format: {
//         page_icon: "icon"
//       }
//     } : undefined);
//     testUpdateMethod<ICollectionViewPageUpdateInput>({
//       child_id: TEST_DATA.block.collection_view_page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       cb: (data) => expect(data?.format?.page_icon).toBe("icon")
//     })
//   })
// })

// describe.skip("Delete methods for space", ()=>{
//   beforeEach(()=>{
//     space.stack = [];
//   })

//   it("Delete [root_page] [id]", async () => {
//     await space.deleteTRootPages([TEST_DATA.block.page[0].data.id]);
//     testDeleteMethod<ISpace>({
//       child_id: TEST_DATA.block.page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       child_path: "pages"
//     });  
//   })

//   it("Delete [root_page] cb", async ()=>{
//     await space.deleteTRootPages((page)=>console.log(page))
//     testDeleteMethod<ISpace>({
//       child_id: TEST_DATA.block.page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       child_path: "pages"
//     })
//   })

//   it("Delete [root_cvp] [id]", async()=>{
//     await space.deleteTRootPages([TEST_DATA.block.collection_view_page[0].data.id]);
//     testDeleteMethod<ISpace>({
//       child_id: TEST_DATA.block.collection_view_page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       child_path: "pages"
//     })
//   })

//   it("Delete [root_cvp] cb", async()=>{
//     await space.deleteTRootPages(page=>page.type === "collection_view_page" && page.id === TEST_DATA.block.collection_view_page[0].data.id);
//     testDeleteMethod<ISpace>({
//       child_id: TEST_DATA.block.collection_view_page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       child_path: "pages"
//     })
//   })
  
//   it("Delete root_page id", async () => {
//     await space.deleteTRootPage(TEST_DATA.block.page[0].data.id);
//     testDeleteMethod<ISpace>({
//       child_id: TEST_DATA.block.page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       child_path: "pages"
//     });  
//   })

//   it("Delete root_page cb", async ()=>{
//     await space.deleteTRootPage((page)=>page.type === "page" && page.id === TEST_DATA.block.page[0].data.id)
//     testDeleteMethod<ISpace>({
//       child_id: TEST_DATA.block.page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       child_path: "pages"
//     })
//   })

//   it("Delete root_cvp id", async()=>{
//     await space.deleteTRootPage(TEST_DATA.block.collection_view_page[0].data.id);
//     testDeleteMethod<ISpace>({
//       child_id: TEST_DATA.block.collection_view_page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       child_path: "pages"
//     })
//   })

//   it("Delete root_cvp cb", async()=>{
//     await space.deleteTRootPage(page=>page.type === "collection_view_page" && page.id === TEST_DATA.block.collection_view_page[0].data.id);
//     testDeleteMethod<ISpace>({
//       child_id: TEST_DATA.block.collection_view_page[0].data.id,
//       parent_id: TEST_DATA.space[0].data.id,
//       parent_type: "space",
//       child_path: "pages"
//     })
//   }) 
// })