const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const protoPath = path.resolve(__dirname, 'protos/phrase.proto');

function getPhraseService() {
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

  const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
  const phraseService = protoDescriptor.phrase.PhraseService;
  
  return phraseService;
}

module.exports = getPhraseService;
