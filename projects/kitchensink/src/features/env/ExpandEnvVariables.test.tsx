import ReactDOM from "react-dom";
import { ExpandEnvVariables } from "./ExpandEnvVariables";

describe("expand .env variables", () => {
	it("renders without crashing", () => {
		const div = document.createElement("div");
		ReactDOM.render(<ExpandEnvVariables />, div);
	});
});
