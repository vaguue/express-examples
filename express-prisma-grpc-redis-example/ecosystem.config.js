const fs = require('fs');
const path = require('path');

module.exports = {
  apps: [
    {
      name: 'casino', 
      script: 'npm run dev',
      watch: ['prisma/schema.prisma', 'package.json', '.env'],
      watch_delay: 1000,
    },
    {
      name: 'casino-grpc', 
      script: 'npm run dev',
      cwd: path.resolve(__dirname, 'grpcServer'),
      watch: ['package.json', '.env'],
      watch_delay: 1000,
    },
  ],
};
