module.exports = {
	hooks: {
		'pre-commit': 'npm run test',
		'pre-push': 'npm run test'
	}
};
