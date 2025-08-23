import ReactDOM from "react-dom";
import { BaseUrl } from "./BaseUrl";

describe("BASE_URL", () => {
	it("renders without crashing", () => {
		const div = document.createElement("div");
		ReactDOM.render(<BaseUrl />, div);
	});
});
