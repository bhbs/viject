const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
	app.use(
		"/posts",
		createProxyMiddleware({
			target: `${process.env.REACT_APP_PROXY_TARGET}`,
			changeOrigin: true,
		}),
	);
};
