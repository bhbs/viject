import { useEffect, useState } from "react";

export const ProxyMiddleware = () => {
	const [post, setPost] = useState();

	useEffect(() => {
		fetch("/posts/1")
			.then((response) => response.json())
			.then((json) => setPost(json));
	}, []);

	return <div id="feature-proxy-middleware">{JSON.stringify(post)}</div>;
};
