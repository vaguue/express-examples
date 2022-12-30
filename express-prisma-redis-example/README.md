# express-prisma-redis-example
Example of a Express.js server + Prisma (MySql) + Redis + Multer for storing files

This server uses JWT and Redis to authenticate users via AT&RT and allows to upload files via multipart/form-data (with 'file' field). API usage example can be found [here](https://github.com/vaguue/express-examples/blob/main/express-prisma-redis-example/test/exampleUsage.js). Routes:
  * /signin [POST] - request access token with id + password (id is either a phone or email).
  * /signin/new_token [POST] - get new access token with refresh token.
  * /signup [POST] - create new user with id + password.
  * /file/upload [POST] - upload new file to the storage and create a database record for this file (with original name, file size, mime type etc).
  * /file/list [GET] - get list of user's files with pagination via list_size and page query parameters.
  * /file/delete/:id [DELETE] - remove file from database and storage.
  * /file/:id [GET] - get file's database record.
  * /file/download/:id [GET] - download file.
  * /file/update/:id [PUT] - update existing record and upload new file for this record.
  * /info [GET] - returns user id.
  * /logout [GET] - deactivate user's AT&RT. \
