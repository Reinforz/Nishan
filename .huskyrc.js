module.exports = {
	hooks: {
		'pre-commit': 'yarn test',
		'pre-push': 'yarn test'
	}
};
