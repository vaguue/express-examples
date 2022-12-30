const { getClientCredentials } = require('@/grpcServer/credentials');
const getService = require('@/grpcServer/getService');

const url = process.env.GRPC_SERVER;

let cached = global.grpc;

if (!cached) {
  cached = global.grpc = { conn: null };
}

function grpc() {
  if (cached.conn) {
    return cached.conn;
  }

  const phraseService = getService();
  const client = new phraseService(url, getClientCredentials());

  cached.conn = client;

  return cached.conn;
}

module.exports = grpc;
