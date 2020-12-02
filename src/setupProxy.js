const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:8080/',
    pathRewrite: {
      '^/api/': '/exist/restxq/',
      '^/api.yaml': '/exist/apps/dracor/api.yaml'
    }
  }));
};
