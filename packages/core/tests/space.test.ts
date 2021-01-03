import { ISpace, TData, TDataType } from "@nishan/types";
import { Collection, Space } from "../dist/api";
import { ICollectionUpdateInput, ICollectionViewPageUpdateInput, IPageUpdateInput, ITPage } from "../dist/types";
import {nishan, COLLECTION_ONE_ID, SPACE_VIEW_ONE_ID, ROOT_COLLECTION_VIEW_PAGE_ONE_ID, USER_ONE_ID, SPACE_ONE_ID, ROOT_PAGE_ONE_ID} from "./constants"

let space: Space = null as any;

beforeAll(async ()=>{
  const user = await nishan.getNotionUser(USER_ONE_ID);
  space = await user.getSpace(SPACE_ONE_ID);
})

function checkRootPages(pages: ITPage, status?:boolean){
  status = status ?? true;
  if(status){
    expect(pages.page.length).toBe(1);
    expect(pages.page[0]).not.toBeNull();
    expect(pages.page[0].id).toBe(ROOT_PAGE_ONE_ID);
    expect(pages.page[0].type).toBe("block");
  }else{
    expect(pages.page.length).toBe(0);
    expect(pages.page[0]).toBeUndefined();
  }
}

function checkRootCollectionViewPages(pages: ITPage, status?:boolean){
  status = status ?? true;
  if(status){
    expect(pages.collection_view_page.length).toBe(1);
    expect(pages.collection_view_page[0]).not.toBeNull();
    expect(pages.collection_view_page[0].id).toBe(ROOT_COLLECTION_VIEW_PAGE_ONE_ID);
    expect(pages.collection_view_page[0].type).toBe("block");
  }else{
    expect(pages.collection_view_page.length).toBe(0);
    expect(pages.collection_view_page[0]).toBeUndefined();
  }
}

function checkRootCollection(collection: Collection, status?:boolean){
  status = status ?? true;
  if(status){
    expect(collection).not.toBeNull();
    expect(collection.id).toBe(COLLECTION_ONE_ID);
  }else{
    expect(collection).toBeUndefined();
  }
}

function keyValueChecker<T extends TData>(data: T, args: Partial<Record<keyof T, string | number | boolean>>){
  Object.keys(args).forEach(key=>expect(data[key as keyof T]).toBe(args[key as keyof T]))
}

function testUpdateMethod<T>({cb, child_id, child_type = "block", parent_id, parent_type}: {
  child_id: string,
  child_type?: TDataType,
  parent_id?: string,
  parent_type?: TDataType,
  cb: (data: T) => void
}){
  const {stack, sync_records} = space.getStackSyncRecords(), check_parent = parent_id && parent_type;
  expect(stack.length).toBe(2);
  expect(sync_records.length).toBe(2);
  expect(sync_records[0][0]).toBe(child_id);
  expect(sync_records[0][1]).toBe(child_type);
  if(check_parent){
    expect(sync_records[1][0]).toBe(parent_id);
    expect(sync_records[1][1]).toBe(parent_type);
  }
  const [child_op, parent_op] = stack;

  cb(child_op.args as T)

  expect(child_op.id).toBe(child_id)    
  expect(child_op.command).toBe("update");
  expect(child_op.table).toBe(child_type);
  expect(child_op.path.length).toBe(0);
  expect(child_op.args.last_edited_by).toBe(USER_ONE_ID);
  expect(child_op.args.last_edited_by_table).toBe("notion_user");
  expect(child_op.args.last_edited_time).toBeLessThanOrEqual(Date.now());

  if(check_parent && parent_op){
    expect(parent_op.id).toBe(parent_id); 
    expect(parent_op.command).toBe("update");
    expect(parent_op.table).toBe(parent_type);
    expect(parent_op.path.length).toBe(0);
    expect(parent_op.args.last_edited_by).toBe(USER_ONE_ID);
    expect(parent_op.args.last_edited_by_table).toBe("notion_user");
    expect(parent_op.args.last_edited_time).toBeLessThanOrEqual(Date.now());
  }
}

describe("Getter methods for space", ()=>{
  it("Get space_view",()=>{
    const space_view = space.getSpaceView();
    expect(space_view).not.toBeNull();
    expect(space_view.id).toBe(SPACE_VIEW_ONE_ID);
  })
  
  it("Get collection.id",()=>{
    const collection_ids = space.getCollectionIds();
    expect(collection_ids.length).toBe(1);
    expect(collection_ids[0]).toBe(COLLECTION_ONE_ID)
  })

  it("Get collection id", async ()=>{
    checkRootCollection(await space.getRootCollection(COLLECTION_ONE_ID))
  })
  
  it("!Get collection !id", async ()=>{
    checkRootCollection(await space.getRootCollection(COLLECTION_ONE_ID.slice(1)), false)
  })
  
  it("Get [collection] [id]", async ()=>{
    checkRootCollection((await space.getRootCollections([COLLECTION_ONE_ID]))[0]);
  })
  
  it("!Get [collection] ![id]", async ()=>{
    checkRootCollection((await space.getRootCollections([COLLECTION_ONE_ID.slice(1)]))[0], false);
  })
  
  it("Get collection cb", async ()=>{
    checkRootCollection(await space.getRootCollection(collection=>collection.id === COLLECTION_ONE_ID));
  })
  
  it("!Get collection !cb", async ()=>{
    checkRootCollection(await space.getRootCollection(collection=>collection.id === COLLECTION_ONE_ID.slice(1)), false);
  })
  
  it("Get [collection] cb.id", async ()=>{
    checkRootCollection((await space.getRootCollections(collection=>collection.id === COLLECTION_ONE_ID))[0]);
  })
  
  it("Get [collection] cb.parent_id", async ()=>{
    checkRootCollection((await space.getRootCollections(collection=>collection.parent_id === ROOT_COLLECTION_VIEW_PAGE_ONE_ID))[0]);
  })
  
  it("Get [collection] undefined", async ()=>{
    checkRootCollection((await space.getRootCollections())[0]);
  })
  
  it("!Get [collection] !cb", async ()=>{
    checkRootCollection((await space.getRootCollections(collection=>collection.id === COLLECTION_ONE_ID.slice(1)))[0], false);
  })
  
  it("Get root_page id", async ()=>{
    checkRootPages(await space.getTRootPage(ROOT_PAGE_ONE_ID))
  })
  
  it("!Get root_page !id", async ()=>{
    checkRootPages(await space.getTRootPage(ROOT_PAGE_ONE_ID.slice(1)), false)
  })
  
  it("Get [root_page] [id]", async ()=>{
    checkRootPages(await space.getTRootPages([ROOT_PAGE_ONE_ID]));
  })
  
  it("!Get [root_page] ![id]", async ()=>{
    checkRootPages(await space.getTRootPages([ROOT_PAGE_ONE_ID.slice(1)]), false);
  })
  
  it("Get root_page cb", async ()=>{
    checkRootPages(await space.getTRootPage(root_page=>root_page.id === ROOT_PAGE_ONE_ID));
  })
  
  it("!Get root_page !cb", async ()=>{
    checkRootPages(await space.getTRootPage(root_page=>root_page.id === ROOT_PAGE_ONE_ID.slice(1)), false);
  })
  
  it("Get [root_page] cb.id", async ()=>{
    checkRootPages(await space.getTRootPages(root_page=>root_page.id === ROOT_PAGE_ONE_ID));
  })
  
  it("Get [root_page] cb.type", async ()=>{
    checkRootPages(await space.getTRootPages(root_page=>root_page.type === "page"));
  })
  
  it("Get [root_page] undefined", async ()=>{
    checkRootPages(await space.getTRootPages());
  })
  
  it("!Get [root_page] !cb", async ()=>{
    checkRootPages(await space.getTRootPages(root_page=>root_page.id === ROOT_PAGE_ONE_ID.slice(1)), false);
  })
  
  
  it("Get root_cvp id", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPage(ROOT_COLLECTION_VIEW_PAGE_ONE_ID))
  })
  
  it("!Get root_cvp !id", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPage(ROOT_COLLECTION_VIEW_PAGE_ONE_ID.slice(1)), false)
  })
  
  it("Get [root_cvp] [id]", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPages([ROOT_COLLECTION_VIEW_PAGE_ONE_ID]));
  })
  
  it("!Get [root_cvp] ![id]", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPages([ROOT_COLLECTION_VIEW_PAGE_ONE_ID.slice(1)]), false);
  })
  
  it("Get root_cvp cb", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPage(root_cvp=>root_cvp.id === ROOT_COLLECTION_VIEW_PAGE_ONE_ID));
  })
  
  it("!Get root_cvp !cb", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPage(root_cvp=>root_cvp.id === ROOT_COLLECTION_VIEW_PAGE_ONE_ID.slice(1)), false);
  })
  
  it("Get [root_cvp] cb.id", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPages(root_cvp=>root_cvp.id === ROOT_COLLECTION_VIEW_PAGE_ONE_ID));
  })
  
  it("Get [root_cvp] cb.type", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPages(root_cvp=>root_cvp.type === "collection_view_page"));
  })
  
  it("Get [root_cvp] undefined", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPages());
  })
  
  it("!Get [root_cvp] !cb", async ()=>{
    checkRootCollectionViewPages(await space.getTRootPages(root_cvp=>root_cvp.id === ROOT_COLLECTION_VIEW_PAGE_ONE_ID.slice(1)), false);
  })
})

describe("Update methods for space", ()=>{
  beforeEach(()=>{
    space.clearStackSyncRecords();
  })

  it("Update space", async ()=>{
    const {stack, sync_records} = space.getStackSyncRecords(),
    update_obj = {
      beta_enabled: true,
      disable_export: true
    };
    await space.update(update_obj);
    expect(stack.length).not.toBe(0);
    expect(sync_records.length).toBe(0);
    keyValueChecker<ISpace>(stack[0].args, update_obj);
    keyValueChecker<ISpace>(space.getCachedData(), update_obj);
  })

  it("Update [root_page] [id]", async ()=>{
    await space.updateRootPages([[ROOT_PAGE_ONE_ID, {
      type: "page",
      format: {
        page_icon: "icon"
      }
    }]]);
    testUpdateMethod<IPageUpdateInput>({
      child_id: ROOT_PAGE_ONE_ID,
      parent_id: SPACE_ONE_ID,
      parent_type: "space",
      cb: (data) => expect(data?.format?.page_icon).toBe("icon")
    });    
  })

  it("Update [root_page] cb", async ()=>{
    await space.updateRootPages((page)=>page.type === "page" && page.id === ROOT_PAGE_ONE_ID ? {
      type: "page",
      format: {
        page_icon: "icon"
      }
    } : undefined)
    testUpdateMethod<IPageUpdateInput>({
      child_id: ROOT_PAGE_ONE_ID,
      parent_id: SPACE_ONE_ID,
      parent_type: "space",
      cb: (data) => expect(data?.format?.page_icon).toBe("icon")
    })
  })

  it("Update [root_cvp] [id]", async()=>{
    await space.updateRootPages([[ROOT_COLLECTION_VIEW_PAGE_ONE_ID, {
      type: "collection_view_page",
      format: {
        page_icon: "icon"
      }
    }]]);
    testUpdateMethod<ICollectionViewPageUpdateInput>({
      child_id: ROOT_COLLECTION_VIEW_PAGE_ONE_ID,
      parent_id: SPACE_ONE_ID,
      parent_type: "space",
      cb: (data) => expect(data?.format?.page_icon).toBe("icon")
    })
  })

  it("Update [root_cvp] cb", async()=>{
    await space.updateRootPages(page=>page.type === "collection_view_page" && page.id === ROOT_COLLECTION_VIEW_PAGE_ONE_ID ? {
      type: "collection_view_page",
      format: {
        page_icon: "icon"
      }
    } : undefined);
    testUpdateMethod<ICollectionViewPageUpdateInput>({
      child_id: ROOT_COLLECTION_VIEW_PAGE_ONE_ID,
      parent_id: SPACE_ONE_ID,
      parent_type: "space",
      cb: (data) => expect(data?.format?.page_icon).toBe("icon")
    })
  })

  it("Update [collection] [id]", async()=>{
    await space.updateRootCollections([[COLLECTION_ONE_ID, {
      description: [["test"]]
    }]]);
    testUpdateMethod<ICollectionUpdateInput>({
      child_id: COLLECTION_ONE_ID,
      child_type: "collection",
      cb: (data) => expect(data?.description?.[0][0]).toBe("test")
    })
  })

  it("Update [collection] cb", async()=>{
    await space.updateRootCollections((collection) => collection.id === COLLECTION_ONE_ID ? {
      description: [["test"]]
    } : undefined);
    testUpdateMethod<ICollectionUpdateInput>({
      child_id: COLLECTION_ONE_ID,
      child_type: "collection",
      cb: (data) => expect(data?.description?.[0][0]).toBe("test")
    })
  })

  it("Update root_page id", async ()=>{
    await space.updateRootPage([ROOT_PAGE_ONE_ID, {
      type: "page",
      format: {
        page_icon: "icon"
      }
    }]);
    testUpdateMethod<IPageUpdateInput>({
      child_id: ROOT_PAGE_ONE_ID,
      parent_id: SPACE_ONE_ID,
      parent_type: "space",
      cb: (data) => expect(data?.format?.page_icon).toBe("icon")
    });    
  })

  it("Update root_page cb", async ()=>{
    await space.updateRootPage((page)=>page.type === "page" && page.id === ROOT_PAGE_ONE_ID ? {
      type: "page",
      format: {
        page_icon: "icon"
      }
    } : undefined)
    testUpdateMethod<IPageUpdateInput>({
      child_id: ROOT_PAGE_ONE_ID,
      parent_id: SPACE_ONE_ID,
      parent_type: "space",
      cb: (data) => expect(data?.format?.page_icon).toBe("icon")
    })
  })

  it("Update root_cvp id", async()=>{
    await space.updateRootPage([ROOT_COLLECTION_VIEW_PAGE_ONE_ID, {
      type: "collection_view_page",
      format: {
        page_icon: "icon"
      }
    }]);
    testUpdateMethod<ICollectionViewPageUpdateInput>({
      child_id: ROOT_COLLECTION_VIEW_PAGE_ONE_ID,
      parent_id: SPACE_ONE_ID,
      parent_type: "space",
      cb: (data) => expect(data?.format?.page_icon).toBe("icon")
    })
  })

  it("Update root_cvp cb", async()=>{
    await space.updateRootPage(page=>page.type === "collection_view_page" && page.id === ROOT_COLLECTION_VIEW_PAGE_ONE_ID ? {
      type: "collection_view_page",
      format: {
        page_icon: "icon"
      }
    } : undefined);
    testUpdateMethod<ICollectionViewPageUpdateInput>({
      child_id: ROOT_COLLECTION_VIEW_PAGE_ONE_ID,
      parent_id: SPACE_ONE_ID,
      parent_type: "space",
      cb: (data) => expect(data?.format?.page_icon).toBe("icon")
    })
  })

  it("Update collection id", async()=>{
    await space.updateRootCollection([COLLECTION_ONE_ID, {
      description: [["test"]]
    }]);
    testUpdateMethod<ICollectionUpdateInput>({
      child_id: COLLECTION_ONE_ID,
      child_type: "collection",
      cb: (data) => expect(data?.description?.[0][0]).toBe("test")
    })
  })

  it("Update collection cb", async()=>{
    await space.updateRootCollection((collection) => collection.id === COLLECTION_ONE_ID ? {
      description: [["test"]]
    } : undefined);
    testUpdateMethod<ICollectionUpdateInput>({
      child_id: COLLECTION_ONE_ID,
      child_type: "collection",
      cb: (data) => expect(data?.description?.[0][0]).toBe("test")
    })
  })
})