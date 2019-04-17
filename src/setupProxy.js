const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/v1/', { target: process.env.BASE_NODE_API, changeOrigin: true }));
};
