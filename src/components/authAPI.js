var Granny = require('../granny.js');

Granny.prototype.setup = async function({ login, password }) {
	var [err, result] = await this.request('POST', '/auth/setup', {
		form: {
			login,
			password,
		},
	});

	if (!err && result) this.setAccessToken(result.accessToken);
	return [err, result];
};

Granny.prototype.login = async function({ login, password }) {
	var [err, result] = await this.request('POST', '/auth/login', {
		form: {
			login,
			password,
		},
	});

	if (!err && result) this.setAccessToken(result.accessToken);
	return [err, result];
};
