const fs = require('fs');

module.exports = {
    devServer: {
      open: process.platform === 'darwin',
      host: '0.0.0.0',
      port: 5010, // CHANGE YOUR PORT HERE!
      https: {
        key: fs.readFileSync('./certs/example.com+5-key.pem'),
        cert: fs.readFileSync('./certs/example.com+5.pem'),
      },
      public: 'https://localhost:5010',
      hotOnly: false,
    },
  }