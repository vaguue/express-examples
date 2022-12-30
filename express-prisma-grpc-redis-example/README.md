# express-prisma-grpc-redis-example
Example of a Express.js server + Prisma (MySql) + Redis + gRPC for communicating with private API (lorem ipsum generator in our case)

This server uses Redis-om to authenticate users via bearer tokens. API usage example can be found [here](https://github.com/vaguue/express-examples/blob/main/express-prisma-grpc-redis-example/test/exampleUsage.js)
Routes:
  * /signin [POST] - request bearer token with id + password (id is either a phone or email, after registration the type of id is stored in the database as well).
  * /signup [POST] - create new user (return bearer token after a successful registration).
  * /info [GET] - return id and id type (authenticated only).
  * /phrase [GET] - return random phrase (uses gRPC private API, authenticated only).
  * /latency [GET] - return server latency (authenticated only).
  * /logout [GET] - has "all" query boolean parameter, which determines wheter to logout from all users's session of curent only.
