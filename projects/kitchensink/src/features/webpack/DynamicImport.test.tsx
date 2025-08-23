import ReactDOM from "react-dom";

describe("dynamic import", () => {
	it("renders without crashing", async () => {
		const DynamicImport = (await import("./DynamicImport")).DynamicImport;
		const div = document.createElement("div");
		ReactDOM.render(<DynamicImport />, div);
		expect(div.textContent).toBe("Hello World!");
	});
});
