import Nishan, { NotionUser } from "../dist/Nishan";
import data from "./data";

const nishan = new Nishan({
  token: ""
});

nishan.init_cache = true;

nishan.saveToCache(data.recordMap)

const USER_ONE_ID = "d94caf87-a207-45c3-b3d5-03d157b5b39b";

function checkUser(user: NotionUser){
  expect(user).not.toBeNull();
  expect(user.id).toBe(USER_ONE_ID);
  expect(user.type).toBe("notion_user");
}

it("Sets up default configuration for Nishan",()=>{
  expect(nishan.defaultExecutionState).toBe(true);
  expect(nishan.interval).toBe(500);
})

it("Gets the correct notion user when passed a correct id", async ()=>{
  const user = await nishan.getNotionUser(USER_ONE_ID);
  checkUser(user)
})

it("Doesnt get the notion user when passed a wrong id", async ()=>{
  const user = await nishan.getNotionUser(USER_ONE_ID.slice(1));
  expect(user).toBeUndefined();
})

it("Gets the notion users when passed an array of correct id", async ()=>{
  const users = await nishan.getNotionUsers([USER_ONE_ID]);
  expect(users.length).toBe(1);
  checkUser(users[0]);
})

it("Doesnt get the notion users when passed an array of wrong id", async ()=>{
  const users = await nishan.getNotionUsers([USER_ONE_ID.slice(1)]);
  expect(users.length).toBe(0);
  expect(users[0]).toBeUndefined();
})

it("Gets the notion user when passed a correct callback", async ()=>{
  const user = await nishan.getNotionUser((user)=>user.id === USER_ONE_ID);
  checkUser(user);
})

it("Doesnt get the notion user when passed a wrong callback", async ()=>{
  const user = await nishan.getNotionUser((user)=>user.id === USER_ONE_ID.slice(1));
  expect(user).toBeUndefined();
})

it("Gets the notion users when passed a correct callback", async ()=>{
  const users = await nishan.getNotionUsers((user)=>user.id === USER_ONE_ID);
  checkUser(users[0]);
})

it("Gets all the notion users when passed undefined", async ()=>{
  const users = await nishan.getNotionUsers();
  checkUser(users[0]);
})

it("Doesnt get the notion users when passed a wrong callback", async ()=>{
  const users = await nishan.getNotionUsers((user)=>user.id === USER_ONE_ID.slice(1));
  expect(users.length).toBe(0);
  expect(users[0]).toBeUndefined();
})