# express-examples
Examples list:
* [express-prisma-grpc-redis-example](https://github.com/vaguue/express-examples/tree/main/express-prisma-grpc-redis-example) — This example demonstrates how Express.js can be used in conjunction with gRPC. For example, Express.js + Redis-OM can handle authorization, and gRPC can provide some private API. For security (private API is accessible only from Express.js server) I used SSL certificated feature and access token defined .env. Routes:
  * /signin [POST] - request bearer token with id + password (id is either a phone or email, after registration the type of id is stored in the database as well).
  * /signup [POST] - create new user (return bearer token after a successful registration).
  * /info [GET] - return id and id type (authenticated only).
  * /phrase [GET] - return random phrase (uses gRPC private API, authenticated only).
  * /latency [GET] - return server latency (authenticated only).
  * /logout [GET] - has "all" query boolean parameter, which determines wheter to logout from all users's session of curent only.
* [express-prisma-redis-example](https://github.com/vaguue/express-examples/tree/main/express-prisma-redis-example) — This example uses multer for storing and serving user files and Redis for implementing Access Token + Refresh Token authentication mechanism. All routes except signin and signup and accessible only for authenticated users. Routes:
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
  * /logout [GET] - deactivate user's AT&RT.
NOTE: on each server Cors is configured to accept requests from any origin and there is an initdb.sh script for database initialization (TODO: user docker-compose.yml). And there is a exampleUsage.js file in test folder.
