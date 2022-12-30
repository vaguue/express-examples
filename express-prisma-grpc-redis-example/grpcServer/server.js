require('dotenv').config();
const getPhraseService = require('./getService');
const grpc = require('@grpc/grpc-js');
const { getServerCredentials } = require('./credentials');

const { faker } = require('@faker-js/faker');

const phraseService = getPhraseService();

const secret = process.env.API_SECRET;

function getPhrase() {
  return {
    content: faker.lorem.sentence(),
  };
}

function getPhraseWrapper(call, callback) {
  const { token } = call.request;
  if (token != secret) {
    callback(Error('no-access'), { message: 'error' });
  }
  else {
    callback(null, getPhrase());
  }
}

const server = new grpc.Server();

const bindAddr = process.env.BIND_ADDR;

server.addService(phraseService.service, { getPhrase: getPhraseWrapper });
server.bindAsync(bindAddr, getServerCredentials(), () => {
  server.start();
  console.log('[*] started grpcServer on', bindAddr);
});
