# Perfect Garage Admin Back-End

API to manage perfect garage Mongodb database.

Written with NodeJS + Express + Mongoose.

Requires admin-frontend webapp.

## Quick start

```
npm install
```
```
npm run start
```

Create passwords.js file at the project root:

```
module.exports.mongodb = 'mongodb://user:password@server:port/db';
module.exports.jwtSecret = 'any string';
module.exports.backendUsers = new Map();
module.exports.backendUsers.set('admin', 'admin');
```
