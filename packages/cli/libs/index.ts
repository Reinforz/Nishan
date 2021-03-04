#!/usr/bin/env node
require('dotenv').config({ path: '../../.env' });
import yargs from 'yargs';
import pageCommand from './Page';
import { setIdentifierPositionalArgs } from './utils';

async function main () {
	const argv = yargs(process.argv)
		.command('page [create] [title]', 'CRUD Operations on a page', (yargs) => {
			yargs.positional('create', {
				describe: 'Create a root page',
				alias: 'c'
			}).required;

			yargs.positional('title', {
				describe: 'title of the page to create',
				type: 'string',
				alias: 't'
			}).required;
		})
		.command('page [get] [identifier]', 'CRUD Operations on a page', (yargs) => {
			yargs.positional('get', {
				describe: 'Get a page of a certain id',
				alias: 'g'
			}).required;

			setIdentifierPositionalArgs(yargs);
		})
		.command('page [update] [identifier] [title]', 'CRUD Operations on a page', (yargs) => {
			yargs.positional('update', {
				describe: 'Update a page of a certain id',
				alias: 'u'
			}).required;

			setIdentifierPositionalArgs(yargs);

			yargs.positional('newTitle', {
				describe: 'New title of the update page',
				type: 'string',
				alias: 'nt'
			}).required;
		})
		.command('page [delete] [identifier]', 'CRUD Operations on a page', (yargs) => {
			yargs.positional('delete', {
				describe: 'Delete a page of a certain id',
				alias: 'd'
			}).required;

			setIdentifierPositionalArgs(yargs);
		})
		.option('verbose', {
			alias: 'v',
			type: 'boolean',
			description: 'Run with verbose logging',
			default: false
		}).argv;

	if (argv._[2] === 'page') await pageCommand(argv);
}

main();
