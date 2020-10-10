const colors = require('colors');

module.exports = {
	error: (msg) => console.log(colors.red.bold(msg)),
	warn: (msg) => console.log(colors.yellow.bold(msg))
};
