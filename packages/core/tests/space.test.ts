import { ISpace, TData } from "@nishan/types";
import { Collection, Space } from "../dist/api";
import { ITPage } from "../dist/types";
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
    space.clearStackSyncRecords();
  })
})