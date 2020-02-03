var Granny = require('../granny.js');

Granny.prototype.getStatus = async function() {
	return await this.request('GET', '/_status', {}, { auth: ['accessToken'] });
};
