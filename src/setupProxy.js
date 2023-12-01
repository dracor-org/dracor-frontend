const {createProxyMiddleware} = require('http-proxy-middleware');

const proxyPath = process.env.PROXY_PATH || '/exist/restxq/v1/';

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://localhost:8080/',
      pathRewrite: {
        '^/api/v0/': '/exist/restxq/v0/',
        '^/api/v1/': proxyPath,
      },
    })
  );
};
