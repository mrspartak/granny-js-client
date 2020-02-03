'use strict';
const superagent = require('superagent');
const crypto = require('crypto');

require('util').inherits(Granny, require('events').EventEmitter);

module.exports = Granny;

/**
 * A Granny API contructor
 * @param {Object} options - Setup object
 * @param {string} options.accessToken - Login acces token to use for managment API
 * @param {string} options.domain - Granny server domain to send API request to
 * @param {string} options.accessKey - Granny server domain accessKey
 * @param {string} options.accessSecret - Granny server domain accessSecret
 */
function Granny(options = {}) {
	/* Access level / credentials */
	this.accessToken = false;
	if (options.accessToken) this.setAccessToken(options.accessToken);

	/* Access level / domain */
	this.domain = '';
	if (options.domain) this.setDomain(options.domain);

	this.accessKey = options.accessKey || '';
	this.accessSecret = options.accessSecret || '';
}

/**
 * Update domain specific options
 * @param {Object} options - Setup object
 * @param {string} options.domain - Granny server domain to send API request to
 * @param {string} options.accessKey - Granny server domain accessKey
 * @param {string} options.accessSecret - Granny server domain accessSecret
 */
Granny.prototype.setOptions = function(options) {
	/* Access level / domain */
	if (options.domain) this.setDomain(options.domain);
	if (options.accessKey) this.accessKey = options.accessKey;
	if (options.accessSecret) this.accessSecret = options.accessSecret;
};

/**
 * Update login access token
 * @param {string} token - Login acces token to use for managment API
 */
Granny.prototype.setAccessToken = function(token) {
	this.accessToken = token;
};

/**
 * Update domain to send API to
 * @param {string} domain
 */
Granny.prototype.setDomain = function(domain) {
	this.domain = domain;
};

Granny.prototype.request = async function(method, path, data = {}, options = {}) {
	try {
		let request = superagent;

		if (method == 'GET') {
			request = request.get(this.domain + path);
		} else if (method == 'POST') {
			request = request.post(this.domain + path);
		} else throw new Error('method is not supported');

		if (data.query) request = request.query(data.query);
		if (data.form) request = data.file ? request.field(data.form) : request.send(data.form);
		if (data.file) request = request.attach('image', data.file);

		request = request.set('Accept', 'application/json');

		//auth
		if (options.auth) {
			if (options.auth.indexOf('accessToken') != -1 && this.accessToken)
				request = request.set('Authorization', this.accessToken);

			if (options.auth.indexOf('accessKey') != -1 && this.accessKey && this.accessSecret) {
				let sign =
					this.accessKey +
					'||' +
					crypto
						.createHmac('sha1', this.accessSecret)
						.update(this.accessKey)
						.digest('hex');

				if (method == 'POST') request = data.file ? request.field({ sign }) : request.send({ sign });
				if (method == 'GET') request = request.query({ sign });
			}
		}

		let response = await request;

		let responseData = response.text;
		if (response.type == 'application/json') {
			responseData = JSON.parse(responseData);
			if (!responseData.success && responseData.error) {
				if (responseData.error == 'login_required') this.emit('logged_out');

				return [new Error(responseData.error), responseData, response];
			}
		}

		return [null, responseData, response];
	} catch (e) {
		return [e, null, null];
	}
};



/* API */


/* openAPI */
/**
 * Open API | Get server/client status
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, result] = await api.getStatus()
 */
Granny.prototype.getStatus = async function() {
	return await this.request('GET', '/_status', {}, { auth: ['accessToken'] });
};


/* authAPI */
/**
 * Auth API | Setup server with your credentials when first launched
 * @param {Object} credentials - credentials object
 * @param {String} credentials.login
 * @param {String} credentials.password
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, result] = await api.setup({ login: 'login', password: 'password' })
 */
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

/**
 * Auth API | Login and get your access token
 * @param {Object} credentials - credentials object
 * @param {String} credentials.login
 * @param {String} credentials.password
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, result] = await api.login({ login: 'login', password: 'password' })
 */
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


/* domainAPI */
/**
 * Domain API | Add new domain to serve your files
 * @param {Object} options - options object
 * @param {String} options.domain - full domain name
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, result] = await api.addDomain({ domain: 'cdn.example.com' })
 */
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

/**
 * Domain API | Get all domain information
 * @param {Object} options - options object
 * @param {String} options.domain - full domain name
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, result] = await api.getDomain({ domain: 'cdn.example.com' })
 */
Granny.prototype.getDomain = async function({ domain }) {
	var [err, result, response] = await this.request('GET', '/domain/id/' + domain, {}, { auth: ['accessToken'] });
	return [err, result ? result.domain : null, response];
};

/**
 * Domain API | Get all domains
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, result] = await api.listDomains()
 */
Granny.prototype.listDomains = async function() {
	var [err, result, response] = await this.request('GET', '/domain/list', {}, { auth: ['accessToken'] });
	return [err, result ? result.domains : null, response];
};

/* imageAPI */
/**
 * Image API | Upload image
 * @param {Object} options - options object
 * @param {String} options.path - relative path for the image you want it will be avialable
 * @param {File} options.image - image
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, result] = await api.uploadImage({ path: '/avatars/user_1.jpg', image: new Buffer(...) })
 */
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

/* directoryAPI */
/**
 * Directory API | Get listing for given path
 * @param {Object} options - options object
 * @param {String} options.path - relative path for getting content
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, result] = await api.listDirectory({ path: '/avatars/' })
 */
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