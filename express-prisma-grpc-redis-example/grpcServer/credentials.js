const fs = require('fs');
const path = require('path');
const grpc = require('@grpc/grpc-js');

function getServerCredentials() {
  const serverCert = fs.readFileSync(path.resolve(__dirname, 'certs/server-cert.pem'));
  const serverKey = fs.readFileSync(path.resolve(__dirname, 'certs/server-key.pem'));

  const serverCredentials = grpc.ServerCredentials.createSsl(
    null,
    [
      {
        cert_chain: serverCert,
        private_key: serverKey,
      },
    ],
    false
  );

  return serverCredentials;
}

function getClientCredentials() {
  const rootCert = fs.readFileSync(path.resolve(__dirname, 'certs/ca-cert.pem'));

  const channelCredentials = grpc.ChannelCredentials.createSsl(rootCert);

  return channelCredentials;
}

module.exports = { getServerCredentials, getClientCredentials };
