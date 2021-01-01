module.exports = {
	hooks: {
		'pre-commit': 'npm run typecheck && npm run lint',
		'pre-push': 'npm run lint'
	}
};
