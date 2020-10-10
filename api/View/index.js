class View {
	constructor (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (this[key] = value));
	}
}

module.exports = View;
