#!/usr/bin/env node
require('dotenv').config({ path: '../../.env' });
import { Nishan } from '@nishans/core';
import yargs from 'yargs/yargs';

async function main () {
	const argv: any = yargs(process.argv)
		.command('page get [id]', 'CRUD Operations on a page', (yargs) => {
			yargs.positional('get', {
				describe: 'Get a page of a certain id',
			}).required;
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
		})
		.option('verbose', {
			alias: 'v',
			type: 'boolean',
			description: 'Run with verbose logging'
		}).argv;
  
	if (argv._[2] === 'page') {
		const nishan = new Nishan({
			token: process.env.NISHAN_TOKEN_V2 as string,
      interval: parseInt(process.env.NISHAN_REQUEST_INTERVAL as string ?? 0) as number
		});

		const notion_user = await nishan.getNotionUser(process.env.NISHAN_NOTION_USER_ID);
		const space = await notion_user.getSpace(process.env.NISHAN_NOTION_SPACE_ID);
    const identifier = argv.id ?? argv.title;
		const {page} = await space.getRootPage((page)=>{
      if(argv.id) return page.type === "page" && page.id === argv.id;
      else if(argv.title) return page.type === "page" && page.properties.title[0][0] === argv.title;
    });
    const target_page = page.get(identifier);
    if(target_page)
      console.log(JSON.stringify(target_page.getCachedData(), null, 2));
	}
}

main();
