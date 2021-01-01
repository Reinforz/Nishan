import Nishan, { Space } from "../dist/Nishan";
import data from "./data";

const nishan = new Nishan({
  token: ""
});

nishan.init_cache = true;

nishan.saveToCache(data.recordMap)

const USER_ONE_ID = "d94caf87-a207-45c3-b3d5-03d157b5b39b",
  SPACE_ONE_ID = "d2498a62-99ed-4ffd-b56d-e986001729f4";

function checkSpace(space: Space){
  expect(space).not.toBeNull();
  expect(space.id).toBe(SPACE_ONE_ID);
  expect(space.type).toBe("space");
}

it("Gets the correct space when passed a correct id", async ()=>{
  const user = await nishan.getNotionUser(USER_ONE_ID);
  const space = await user.getSpace(SPACE_ONE_ID);
  checkSpace(space)
})