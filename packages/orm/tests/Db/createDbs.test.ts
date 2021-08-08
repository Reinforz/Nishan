import { NotionCore } from "@nishans/core"
import {NotionOrm} from "../../libs"

it(`Should create database`, async ()=> {
  const space = new NotionCore.Api.Space(creatDefaultNishanArg())
  NotionOrm.Db.create(['First Database'])
})