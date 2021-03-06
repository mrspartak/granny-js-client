<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [Granny][1]
    -   [Parameters][2]
    -   [setOptions][3]
        -   [Parameters][4]
    -   [setAccessToken][5]
        -   [Parameters][6]
    -   [setDomain][7]
        -   [Parameters][8]
    -   [getStatus][9]
        -   [Examples][10]
    -   [getMe][11]
        -   [Examples][12]
    -   [setup][13]
        -   [Parameters][14]
        -   [Examples][15]
    -   [login][16]
        -   [Parameters][17]
        -   [Examples][18]
    -   [addDomain][19]
        -   [Parameters][20]
        -   [Examples][21]
    -   [editDomain][22]
        -   [Parameters][23]
        -   [Examples][24]
    -   [getDomain][25]
        -   [Parameters][26]
        -   [Examples][27]
    -   [listDomains][28]
        -   [Examples][29]
    -   [deleteDomain][30]
        -   [Parameters][31]
        -   [Examples][32]
    -   [uploadImage][33]
        -   [Parameters][34]
        -   [Examples][35]
    -   [getImage][36]
        -   [Parameters][37]
        -   [Examples][38]
    -   [deleteImage][39]
        -   [Parameters][40]
        -   [Examples][41]
    -   [listDirectory][42]
        -   [Parameters][43]
        -   [Examples][44]
    -   [listUsers][45]
        -   [Examples][46]
    -   [addUser][47]
        -   [Parameters][48]
        -   [Examples][49]
    -   [getUser][50]
        -   [Parameters][51]
        -   [Examples][52]
    -   [editUser][53]
        -   [Parameters][54]
        -   [Examples][55]

## Granny

A Granny API contructor

### Parameters

-   `options` **[Object][56]** Setup object (optional, default `{}`)
    -   `options.accessToken` **[string][57]** Login acces token to use for managment API
    -   `options.domain` **[string][57]** Granny server domain to send API request to
    -   `options.accessKey` **[string][57]** Granny server domain accessKey
    -   `options.accessSecret` **[string][57]** Granny server domain accessSecret

### setOptions

Update domain specific options

#### Parameters

-   `options` **[Object][56]** Setup object
    -   `options.domain` **[string][57]** Granny server domain to send API request to
    -   `options.accessKey` **[string][57]** Granny server domain accessKey
    -   `options.accessSecret` **[string][57]** Granny server domain accessSecret

### setAccessToken

Update login access token

#### Parameters

-   `token` **[string][57]** Login acces token to use for managment API

### setDomain

Update domain to send API to

#### Parameters

-   `domain` **[string][57]** 

### getStatus

Open API | Get server/client status

#### Examples

```javascript
var [err, result] = await api.getStatus()
```

Returns **[Promise][58]** [Error, Result]

### getMe

Open API | Get info about current user

#### Examples

```javascript
var [err, result] = await api.getMe()
```

Returns **[Promise][58]** [Error, Result]

### setup

Auth API | Setup server with your credentials when first launched

#### Parameters

-   `credentials` **[Object][56]** credentials object
    -   `credentials.login` **[String][57]** 
    -   `credentials.password` **[String][57]** 

#### Examples

```javascript
var [err, result] = await api.setup({ login: 'login', password: 'password' })
```

Returns **[Promise][58]** [Error, Result]

### login

Auth API | Login and get your access token

#### Parameters

-   `credentials` **[Object][56]** credentials object
    -   `credentials.login` **[String][57]** 
    -   `credentials.password` **[String][57]** 

#### Examples

```javascript
var [err, result] = await api.login({ login: 'login', password: 'password' })
```

Returns **[Promise][58]** [Error, Result]

### addDomain

Domain API | Add new domain to serve your files

#### Parameters

-   `options` **[Object][56]** options object
    -   `options.domain` **[String][57]** full domain name
    -   `options.s3` **[Object][56]** S3 storage connection option (optional, default `{}`)
        -   `options.s3.endPoint` **[String][57]** S3 storage endPoint like s3.amazonaws.com
        -   `options.s3.accessKey` **[String][57]** S3 storage accessKey
        -   `options.s3.secretKey` **[String][57]** S3 storage secretKey
        -   `options.s3.port` **([Number][59] \| [Boolean][60])** S3 storage port, for example if you ue local S3 storage Minio (optional, default `false`)
        -   `options.s3.useSSL` **[Boolean][60]?** S3 storage use SSL connection
    -   `options.createBucket` **[Boolean][60]** You can set false if you want to use existing bucket (optional, default `true`)
    -   `options.bucket` **[String][57]** if you need specific bucket name. (optional, default `options.domain`)

#### Examples

```javascript
var [err, result] = await api.addDomain({ domain: 'cdn.example.com' })
```

Returns **[Promise][58]** [Error, Result]

### editDomain

Domain API | Edit domain

#### Parameters

-   `options` **[Object][56]** options object
    -   `options.domain` **[String][57]** domain to edit
    -   `options.referer` **[Array][61]** list of strings to allow referer request. \* - any, **allow_direct** - direct request, 'string' any string or regex to match referer (optional, default `false`)
    -   `options.ttl` **[Array][61]** time in hours to cache modified image, 0 - do not cache modified image (optional, default `false`)
    -   `options.users` **[Array][61]** list of users belongs to domain (optional, default `false`)
    -   `options.maxSize` **[Number][59]** max size of bucket in bytes (can be changed only by admin) 0 - unlimited (optional, default `false`)

#### Examples

```javascript
//mywebsite.com will match any url containing this string, so subdomains too
var [err, changed] = await api.editDomain({domain: 'cdn.example.com', users: ['5e35ce81cd91107c2ca1ab64'], referer: ['mywebsite.com', '__allow_direct__']})
```

Returns **[Promise][58]** [Error, Result]

### getDomain

Domain API | Get all domain information

#### Parameters

-   `options` **[Object][56]** options object
    -   `options.domain` **[String][57]** full domain name

#### Examples

```javascript
var [err, result] = await api.getDomain({ domain: 'cdn.example.com' })
```

Returns **[Promise][58]** [Error, Result]

### listDomains

Domain API | Get all domains

#### Examples

```javascript
var [err, result] = await api.listDomains()
```

Returns **[Promise][58]** [Error, Result]

### deleteDomain

Domain API | Delete domain and all its files

#### Parameters

-   `options` **[Object][56]** options object
    -   `options.domain` **[String][57]** domain name

#### Examples

```javascript
var [err, deleted] = await api.deleteDomain({ domain : 'cdn.example.com' })
```

Returns **[Promise][58]** [Error, Result]

### uploadImage

Image API | Upload image

#### Parameters

-   `options` **[Object][56]** options object
    -   `options.path` **[String][57]** relative path for the image you want it will be avialable
    -   `options.image` **File** image

#### Examples

```javascript
var [err, result] = await api.uploadImage({ path: '/avatars/user_1.jpg', image: new Buffer(...) })
```

Returns **[Promise][58]** [Error, Result]

### getImage

Image API | Get image information

#### Parameters

-   `options` **[Object][56]** options object
    -   `options.path` **[String][57]** relative path for the image you want it will be avialable

#### Examples

```javascript
var [err, image] = await api.getImage({ path: '/avatars/user_1.jpg' })
```

Returns **[Promise][58]** [Error, Result]

### deleteImage

Image API | Delete image

#### Parameters

-   `options` **[Object][56]** options object
    -   `options.path` **[String][57]** relative path for the image you want it will be avialable

#### Examples

```javascript
var [err, deleted] = await api.deleteImage({ path: '/avatars/user_1.jpg' })
```

Returns **[Promise][58]** [Error, Result]

### listDirectory

Directory API | Get listing for given path

#### Parameters

-   `options` **[Object][56]** options object
    -   `options.path` **[String][57]** relative path for getting content

#### Examples

```javascript
var [err, result] = await api.listDirectory({ path: '/avatars/' })
```

Returns **[Promise][58]** [Error, Result]

### listUsers

User API [admin_only] | Get all users

#### Examples

```javascript
var [err, users] = await api.listUsers()
```

Returns **[Promise][58]** [Error, Result]

### addUser

User API [admin_only] | Add new users

#### Parameters

-   `options` **[Object][56]** options object
    -   `options.login` **[String][57]** user login
    -   `options.password` **[String][57]** user password
    -   `options.role` **[String][57]** user role [admin|client], default client (optional, default `'client'`)

#### Examples

```javascript
var [err, login] = await api.addUser({lodin: 'sampleuser', password: 'samplepassword'})
```

Returns **[Promise][58]** [Error, Result]

### getUser

User API [admin_only] | Get user information

#### Parameters

-   `options` **[Object][56]** options object
    -   `options.login` **[String][57]** user login

#### Examples

```javascript
var [err, user] = await api.getUser({ login: 'sampleuser' })
```

Returns **[Promise][58]** [Error, Result]

### editUser

User API [admin_only] | Edit user

#### Parameters

-   `options` **[Object][56]** options object
    -   `options.login` **[String][57]** login of user to edit
    -   `options.password` **[String][57]** new user password (optional, default `false`)
    -   `options.role` **[String][57]** new user role [admin|client] (optional, default `false`)
    -   `options.domains` **[Array][61]** list of domains belongs to user (optional, default `false`)
    -   `options.canAddDomains` **[Boolean][60]** allow/disallow user to add domains (optional, default `false`)

#### Examples

```javascript
var [err, changed] = await api.editUser({lodin: 'sampleuser', domains: ['5e35ce81cd91107c2ca1ab64'], role: 'client'})
```

Returns **[Promise][58]** [Error, Result]

[1]: #granny

[2]: #parameters

[3]: #setoptions

[4]: #parameters-1

[5]: #setaccesstoken

[6]: #parameters-2

[7]: #setdomain

[8]: #parameters-3

[9]: #getstatus

[10]: #examples

[11]: #getme

[12]: #examples-1

[13]: #setup

[14]: #parameters-4

[15]: #examples-2

[16]: #login

[17]: #parameters-5

[18]: #examples-3

[19]: #adddomain

[20]: #parameters-6

[21]: #examples-4

[22]: #editdomain

[23]: #parameters-7

[24]: #examples-5

[25]: #getdomain

[26]: #parameters-8

[27]: #examples-6

[28]: #listdomains

[29]: #examples-7

[30]: #deletedomain

[31]: #parameters-9

[32]: #examples-8

[33]: #uploadimage

[34]: #parameters-10

[35]: #examples-9

[36]: #getimage

[37]: #parameters-11

[38]: #examples-10

[39]: #deleteimage

[40]: #parameters-12

[41]: #examples-11

[42]: #listdirectory

[43]: #parameters-13

[44]: #examples-12

[45]: #listusers

[46]: #examples-13

[47]: #adduser

[48]: #parameters-14

[49]: #examples-14

[50]: #getuser

[51]: #parameters-15

[52]: #examples-15

[53]: #edituser

[54]: #parameters-16

[55]: #examples-16

[56]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[57]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[58]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[59]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[60]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[61]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
