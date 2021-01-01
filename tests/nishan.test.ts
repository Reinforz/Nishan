import Nishan from "../dist/Nishan";
import data from "./data";

const nishan = new Nishan({
  token: ""
});

nishan.init_cache = true;

nishan.saveToCache(data.recordMap)

it("Sets up default configuration for Nishan",()=>{
  expect(nishan.defaultExecutionState).toBe(true);
  expect(nishan.interval).toBe(500);
})

it("Gets the correct notion user when passed id", async ()=>{
  const user = await nishan.getNotionUser("d94caf87-a207-45c3-b3d5-03d157b5b39b");
  expect(user).not.toBeNull();
  expect(user.id).toBe("d94caf87-a207-45c3-b3d5-03d157b5b39b");
  expect(user.type).toBe("notion_user");
})

it("Doesnt get the correct notion user when passed wrong id", async ()=>{
  const user = await nishan.getNotionUser("d94caf87-a207-45c3-b3d5-03d157b5b39c");
  expect(user).toBeUndefined();
})