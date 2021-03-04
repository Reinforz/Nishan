import yargs from 'yargs';

export function setIdentifierPositionalArgs (yargs: yargs.Argv<Record<string, unknown>>) {
	yargs.positional('id', {
		describe: 'Id of the page to get',
		type: 'string',
		alias: 'i'
	}).required;

	yargs.positional('title', {
		describe: 'title of the page to get',
		type: 'string',
		alias: 't'
	}).required;
}
