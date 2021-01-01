import { Space } from "../dist/api";
import { ITPage } from "../dist/types";
import {nishan, USER_ONE_ID, SPACE_ONE_ID, ROOT_PAGE_ONE_ID} from "./constants"

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

it("Get [root_page] cb", async ()=>{
  checkRootPages(await space.getTRootPages(root_page=>root_page.id === ROOT_PAGE_ONE_ID));
})

it("Get [root_page] undefined", async ()=>{
  checkRootPages(await space.getTRootPages());
})

it("!Get [root_page] !cb", async ()=>{
  checkRootPages(await space.getTRootPages(root_page=>root_page.id === ROOT_PAGE_ONE_ID.slice(1)), false);
})