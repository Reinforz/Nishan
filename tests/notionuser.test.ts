import Nishan, { NotionUser, Space } from "../dist/Nishan";
import data from "./data";

const nishan = new Nishan({
  token: ""
});

nishan.init_cache = true;

nishan.saveToCache(data.recordMap)

const USER_ONE_ID = "d94caf87-a207-45c3-b3d5-03d157b5b39b",
  SPACE_ONE_ID = "d2498a62-99ed-4ffd-b56d-e986001729f4";
let user: NotionUser = null as any;

beforeAll(async ()=>{
  user = await nishan.getNotionUser(USER_ONE_ID)
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

it("Get [space] [ids]", async ()=>{
  checkSpaces(await user.getSpaces([SPACE_ONE_ID]));
})