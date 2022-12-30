# express-examples
Examples list:
* [express-prisma-grpc-redis-example](https://github.com/vaguue/express-examples/tree/main/express-prisma-grpc-redis-example) — This example demonstrates how Express.js can be used in conjunction with gRPC. For example, Express.js + Redis-OM can handle authorization, and gRPC can provide some private API. For security (private API is accessible only from Express.js server) I used SSL certificated feature and access token defined .env.
* [express-prisma-redis-example](https://github.com/vaguue/express-examples/tree/main/express-prisma-redis-example) — This example uses multer for storing and serving user files and Redis for implementing Access Token + Refresh Token authentication mechanism. All routes except /signin and /signup and accessible only for authenticated users.

NOTE: on each server Cors is configured to accept requests from any origin and there is the initdb.sh script for database initialization (TODO: user docker-compose.yml). And there is a exampleUsage.js file in test folder.
