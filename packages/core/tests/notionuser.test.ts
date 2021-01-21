import { NotionUser, Space } from "../dist/api";
import {nishan, USER_ONE_ID, SPACE_ONE_ID} from "./constants"

let user: NotionUser = null as any;

beforeAll(async ()=>{
  user = await nishan.getNotionUser(USER_ONE_ID)
  user.init_cache = true;
})

function checkSpace(space: Space, status?: boolean){
  status = status ?? true;
  if(status){
    expect(space).not.toBeNull();
    expect(space.id).toBe(SPACE_ONE_ID);
    expect(space.type).toBe("space");
  }else{
    expect(space).toBeUndefined();
  }
}

function checkSpaces(spaces: Space[], status?:boolean){
  status = status ?? true;
  if(status){
    expect(spaces.length).toBe(1);
    expect(spaces[0]).not.toBeNull();
    expect(spaces[0].id).toBe(SPACE_ONE_ID);
    expect(spaces[0].type).toBe("space");
  }else{
    expect(spaces.length).toBe(0);
    expect(spaces[0]).toBeUndefined();
  }
}

it("Get space id", async ()=>{
  checkSpace(await user.getSpace(SPACE_ONE_ID))
})

it("!Get space !id", async ()=>{
  checkSpace(await user.getSpace(SPACE_ONE_ID.slice(1)), false)
})

it("Get [space] [id]", async ()=>{
  checkSpaces(await user.getWorkSpaces([SPACE_ONE_ID]));
})

it("!Get [space] ![id]", async ()=>{
  checkSpaces(await user.getWorkSpaces([SPACE_ONE_ID.slice(1)]), false);
})

it("Get space cb", async ()=>{
  checkSpace(await user.getSpace(space=>space.id === SPACE_ONE_ID));
})

it("!Get space !cb", async ()=>{
  checkSpace(await user.getSpace(space=>space.id === SPACE_ONE_ID.slice(1)), false);
})

it("Get [space] cb", async ()=>{
  checkSpaces(await user.getWorkSpaces(space=>space.id === SPACE_ONE_ID));
})

it("Get [space] undefined", async ()=>{
  checkSpaces(await user.getWorkSpaces());
})

it("!Get [space] !cb", async ()=>{
  checkSpaces(await user.getWorkSpaces(space=>space.id === SPACE_ONE_ID.slice(1)), false);
})

it("Get user_settings", ()=>{
  const user_settings = user.getUserSettings();
  expect(user_settings).not.toBeNull();
  expect(user_settings.id).toBe(USER_ONE_ID);
  expect(user_settings.type).toBe("user_settings")
})

it("Get user_root", ()=>{
  const user_root = user.getUserRoot();
  expect(user_root).not.toBeNull();
  expect(user_root.id).toBe(USER_ONE_ID);
  expect(user_root.type).toBe("user_root")
})
