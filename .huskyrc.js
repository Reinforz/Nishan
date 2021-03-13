module.exports = {
	hooks: {
		'pre-push': 'yarn run sort:packagejson && yarn test'
	}
};