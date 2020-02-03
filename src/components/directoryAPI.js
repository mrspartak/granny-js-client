var Granny = require('../granny.js');

Granny.prototype.listDirectory = async function({ path }) {
	var [err, result, response] = await this.request(
		'GET',
		'/directory/list',
		{
			query: {
				path,
			},
		},
		{ auth: ['accessKey'] },
	);

	return [err, result ? result : null, response];
};
