import { NotionUser } from "../dist/Nishan";
import {USER_ONE_ID, nishan} from "./constants"

function checkUser(user: NotionUser, status?: boolean){
  status = status ?? true;
  if(status){
    expect(user).not.toBeNull();
    expect(user.id).toBe(USER_ONE_ID);
    expect(user.type).toBe("notion_user");
  }else{
    expect(user).toBeUndefined();
  }
}

function checkUsers(users: NotionUser[], status?:boolean){
  status = status ?? true;
  if(status){
    expect(users.length).toBe(1);
    expect(users[0]).not.toBeNull();
    expect(users[0].id).toBe(USER_ONE_ID);
    expect(users[0].type).toBe("notion_user");
  }else{
    expect(users.length).toBe(0);
    expect(users[0]).toBeUndefined();
  }
}

it("Sets up default configuration for Nishan",()=>{
  expect(nishan.defaultExecutionState).toBe(false);
  expect(nishan.interval).toBe(500);
})

it("Get notion_user id", async ()=>{
  checkUser(await nishan.getNotionUser(USER_ONE_ID))
})

it("!Get notion_user !id", async ()=>{
  checkUser(await nishan.getNotionUser(USER_ONE_ID.slice(1)), false)
})

it("Get [notion_user] [id]", async ()=>{
  checkUsers(await nishan.getNotionUsers([USER_ONE_ID]));
})

it("!Get [notion_user] ![id]", async ()=>{
  checkUsers( await nishan.getNotionUsers([USER_ONE_ID.slice(1)]), false)
})

it("Get notion_user cb", async ()=>{
  checkUser(await nishan.getNotionUser((user)=>user.id === USER_ONE_ID));
})

it("!Get notion_user !cb", async ()=>{
  checkUser(await nishan.getNotionUser((user)=>user.id === USER_ONE_ID.slice(1)), false);
})

it("Get [notion_user] cb", async ()=>{
  checkUsers(await nishan.getNotionUsers((user)=>user.id === USER_ONE_ID));
})

it("Get [notion_user] undefined", async ()=>{
  checkUsers(await nishan.getNotionUsers());
})

it("!Get [notion_user] !cb", async ()=>{
  checkUsers(await nishan.getNotionUsers((user)=>user.id === USER_ONE_ID.slice(1)), false)
})