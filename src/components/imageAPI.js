var Granny = require('../granny.js');

Granny.prototype.uploadImage = async function({ path, image }) {
	var [err, result, response] = await this.request(
		'POST',
		'/image/upload',
		{
			form: {
				path,
			},
			file: image,
		},
		{ auth: ['accessKey'] },
	);

	return [err, result ? result : null, response];
};
