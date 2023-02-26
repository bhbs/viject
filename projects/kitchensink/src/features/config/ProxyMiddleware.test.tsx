import React from "react";
import ReactDOM from "react-dom";
import { ProxyMiddleware } from "./ProxyMiddleware";

describe("Proxy middleware", () => {
	it("renders without crashing", () => {
		const div = document.createElement("div");
		ReactDOM.render(<ProxyMiddleware />, div);
	});
});
