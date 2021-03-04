#!/usr/bin/env node
require('dotenv').config({ path: '../../.env' });
import { Nishan } from '@nishans/core';
import yargs from 'yargs';

function setIdentifierPositionArgs (yargs: yargs.Argv<Record<string, unknown>>){
  yargs.positional('id', {
    describe: 'Id of the page to get',
    type: "string",
    alias: "i"
  }).required;

  yargs.positional('title', {
    describe: 'title of the page to get',
    type: "string",
    alias: "t"
  }).required;
}

async function main () {
	const argv: any = yargs(process.argv)
    .command('page create [title]', 'CRUD Operations on a page', (yargs) => {
      yargs.positional('create', {
        describe: 'Create a root page',
        alias: 'c'
      }).required;

      yargs.positional('title', {
        describe: 'title of the page to create',
        type: "string",
        alias: "t"
      }).required;
    })
		.command('page get [identifier]', 'CRUD Operations on a page', (yargs) => {
			yargs.positional('get', {
				describe: 'Get a page of a certain id',
        alias: 'g'
			}).required;
      
      setIdentifierPositionArgs(yargs);
		})
    .command('page update [identifier] [title]', 'CRUD Operations on a page', (yargs) => {
			yargs.positional('update', {
				describe: 'Update a page of a certain id',
        alias: 'u'
			}).required;
      
      setIdentifierPositionArgs(yargs);

      yargs.positional('newTitle', {
        describe: 'New title of the update page',
        type: "string",
        alias: "nt"
      }).required;
		})
    .command('page delete [identifier]', 'CRUD Operations on a page', (yargs) => {
			yargs.positional('delete', {
				describe: 'Delete a page of a certain id',
        alias: 'd'
			}).required;

      setIdentifierPositionArgs(yargs);
		})
		.option('verbose', {
			alias: 'v',
			type: 'boolean',
			description: 'Run with verbose logging'
		}).argv;
  
	if (argv._[2] === 'page') {
    const method = argv._[3];

		const nishan = new Nishan({
			token: process.env.NISHAN_TOKEN_V2 as string,
      interval: parseInt(process.env.NISHAN_REQUEST_INTERVAL as string ?? 0) as number
		});

		const notion_user = await nishan.getNotionUser(process.env.NISHAN_NOTION_USER_ID);
		const space = await notion_user.getSpace(process.env.NISHAN_NOTION_SPACE_ID);

    if(method === "get"){
      const identifier = argv.id ?? argv.title;
      const {page} = await space.getRootPage((page)=>{
        if(argv.id) return page.type === "page" && page.id === argv.id;
        else if(argv.title) return page.type === "page" && page.properties.title[0][0] === argv.title;
      });
      const target_page = page.get(identifier);
      if(target_page)
        console.log(JSON.stringify(target_page.getCachedData(), null, 2));
    } else if (method === "create"){
      await space.createRootPages([
        {
          type: "page",
          contents: [],
          properties: {
            title: [[argv.title]]
          }
        }
      ])
    } else if (method === "update"){
      await space.updateRootPage((page)=>{
        if(argv.id) return page.type === "page" && page.id === argv.id ? {type: "page", properties: {
          title: [[argv.newTitle]]
        }} : undefined;
        else if(argv.title) return page.type === "page" && page.properties.title[0][0] === argv.title ? {type: "page", properties: {
          title: [[argv.newTitle]]
        }} : undefined;
      })
    } else if (method === "delete"){
      await space.deleteRootPage((page)=>{
        if(argv.id) return page.type === "page" && page.id === argv.id;
        else if(argv.title) return page.type === "page" && page.properties.title[0][0] === argv.title;
      })
    }
	}
}

main();
