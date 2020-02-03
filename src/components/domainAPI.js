var Granny = require('../granny.js');

Granny.prototype.addDomain = async function({ domain }) {
	var [err, result, response] = await this.request(
		'POST',
		'/domain/add',
		{
			form: {
				domain,
			},
		},
		{ auth: ['accessToken'] },
	);
	return [err, result ? result.domain : null, response];
};

Granny.prototype.getDomain = async function({ domain } = false) {
	var [err, result, response] = await this.request('GET', '/domain/id/' + domain, {}, { auth: ['accessToken'] });
	return [err, result ? result.domain : null, response];
};

Granny.prototype.listDomains = async function() {
	var [err, result, response] = await this.request('GET', '/domain/list', {}, { auth: ['accessToken'] });
	return [err, result ? result.domains : null, response];
};
