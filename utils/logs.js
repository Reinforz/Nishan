const colors = require('colors');

module.exports = {
	red: (msg) => console.log(colors.red.bold(msg)),
	yellow: (msg) => console.log(colors.yellow.bold(msg))
};
