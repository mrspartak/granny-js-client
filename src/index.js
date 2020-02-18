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
	var [err, result, response] = await this.request('GET', '/_status', {}, { auth: ['accessToken'] });
	return [err, result ? result : null, response];
};

/**
 * Open API | Get info about current user
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, result] = await api.getMe()
 */
Granny.prototype.getMe = async function() {
	var [err, result, response] = await this.request('GET', '/_me', {}, { auth: ['accessToken'] });
	return [err, result ? result.user : null, response];
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
 * @param {String} [options.bucket=options.domain] - if you need specific bucket name.
 * @param {Object} options.s3 - S3 storage connection option
 * @param {String} options.s3.endPoint - S3 storage endPoint like s3.amazonaws.com
 * @param {String} options.s3.accessKey - S3 storage accessKey
 * @param {String} options.s3.secretKey - S3 storage secretKey
 * @param {(Number|Boolean)} [options.s3.port=false] - S3 storage port, for example if you ue local S3 storage Minio
 * @param {Boolean} [options.s3.useSSL] - S3 storage use SSL connection
 * @param {Boolean} [options.createBucket = true] - You can set false if you want to use existing bucket
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, result] = await api.addDomain({ domain: 'cdn.example.com' })
 */
Granny.prototype.addDomain = async function({ domain, s3 = {}, createBucket = true, bucket = false }) {
	var [err, result, response] = await this.request(
		'POST',
		'/domain/add',
		{
			form: {
				domain,
				s3,
				bucket,
				createBucket
			},
		},
		{ auth: ['accessToken'] },
	);
	return [err, result ? result.domain : null, response];
};

/**
 * Domain API | Edit domain
 * @param {Object} options - options object
 * @param {String} options.domain - domain to edit
 * @param {Array} options.referer - list of strings to allow referer request. * - any, __allow_direct__ - direct request, 'string' any string or regex to match referer
 * @param {Array} options.ttl - time in hours to cache modified image, 0 - do not cache modified image
 * @param {Array} options.users - list of users belongs to domain
 * @param {Number} options.maxSize - max size of bucket in bytes (can be changed only by admin) 0 - unlimited
 * @returns {Promise} [Error, Result]
 * @example
 * //mywebsite.com will match any url containing this string, so subdomains too
 * var [err, changed] = await api.editDomain({domain: 'cdn.example.com', users: ['5e35ce81cd91107c2ca1ab64'], referer: ['mywebsite.com', '__allow_direct__']})
 */
Granny.prototype.editDomain = async function({ domain, referer = false, ttl = false, users = false, maxSize = false }) {
	var [err, result, response] = await this.request(
		'POST',
		'/domain/edit',
		{
			form: {
				domain,
				referer,
				ttl,
				users,
				maxSize,
			},
		},
		{ auth: ['accessToken'] },
	);
	return [err, result ? result.domainChanged : null, response];
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

/**
 * Domain API | Delete domain and all its files
 * @param {Object} options - options object
 * @param {String} options.domain - domain name
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, deleted] = await api.deleteDomain({ domain : 'cdn.example.com' })
 */
Granny.prototype.deleteDomain = async function({ domain }) {
	var [err, result, response] = await this.request(
		'POST',
		'/domain/delete/'+ domain,
		{
			
		},
		{ auth: ['accessToken'] }
	);

	return [err, result ? result.success : false, response];
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

/**
 * Image API | Get image information
 * @param {Object} options - options object
 * @param {String} options.path - relative path for the image you want it will be avialable
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, image] = await api.getImage({ path: '/avatars/user_1.jpg' })
 */
Granny.prototype.getImage = async function({ path }) {
	var [err, result, response] = await this.request(
		'GET',
		'/image/info',
		{
			query: {
				path,
			},
		},
		{ auth: ['accessKey'] },
	);

	return [err, result ? result.image : null, response];
};

/**
 * Image API | Delete image
 * @param {Object} options - options object
 * @param {String} options.path - relative path for the image you want it will be avialable
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, deleted] = await api.deleteImage({ path: '/avatars/user_1.jpg' })
 */
Granny.prototype.deleteImage = async function({ path }) {
	var [err, result, response] = await this.request(
		'POST',
		'/image/delete',
		{
			form: {
				path,
			},
		},
		{ auth: ['accessKey'] },
	);

	return [err, result ? result.success : false, response];
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

/* usersAPI */
/**
 * User API [admin_only] | Get all users
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, users] = await api.listUsers()
 */
Granny.prototype.listUsers = async function() {
	var [err, result, response] = await this.request('GET', '/user/list', {}, { auth: ['accessToken'] });
	return [err, result ? result.users : null, response];
};

/**
 * User API [admin_only] | Add new users
 * @param {Object} options - options object
 * @param {String} options.login - user login
 * @param {String} options.password - user password
 * @param {String} options.role - user role [admin|client], default client
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, login] = await api.addUser({lodin: 'sampleuser', password: 'samplepassword'})
 */
Granny.prototype.addUser = async function({ login, password, role = 'client' }) {
	var [err, result, response] = await this.request(
		'POST',
		'/user/add',
		{
			form: {
				login,
				password,
				role,
			},
		},
		{ auth: ['accessToken'] },
	);
	return [err, result ? result.login : null, response];
};

/**
 * User API [admin_only] | Get user information
 * @param {Object} options - options object
 * @param {String} options.login - user login
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, user] = await api.getUser({ login: 'sampleuser' })
 */
Granny.prototype.getUser = async function({ login }) {
	var [err, result, response] = await this.request('GET', '/user/id/' + login, {}, { auth: ['accessToken'] });
	return [err, result ? result.user : null, response];
};

/**
 * User API [admin_only] | Edit user
 * @param {Object} options - options object
 * @param {String} options.login - login of user to edit
 * @param {String} options.password - new user password
 * @param {String} options.role - new user role [admin|client]
 * @param {Array} options.domains - list of domains belongs to user
 * @param {Boolean} options.canAddDomains - allow/disallow user to add domains
 * @returns {Promise} [Error, Result]
 * @example
 * var [err, changed] = await api.editUser({lodin: 'sampleuser', domains: ['5e35ce81cd91107c2ca1ab64'], role: 'client'})
 */
Granny.prototype.editUser = async function({
	login,
	password = false,
	role = false,
	domains = false,
	canAddDomains = false,
}) {
	var [err, result, response] = await this.request(
		'POST',
		'/user/edit',
		{
			form: {
				login,
				password,
				role,
				domains,
				canAddDomains,
			},
		},
		{ auth: ['accessToken'] },
	);
	return [err, result ? result.userChanged : null, response];
};
