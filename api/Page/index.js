class Page {
	constructor (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (this[key] = value));
	}

	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (Page[key] = value));
		return Page;
	}
}

module.exports = Page;
