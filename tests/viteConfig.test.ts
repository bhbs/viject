import { describe, expect, it } from "vitest";
import { createViteConfig, Options } from "../src/viteConfig";

const defaultOptions: Options = {
	ts: false,
};

describe("createViteConfig", () => {
	it("ts: true", () => {
		expect(createViteConfig({ ...defaultOptions, ts: true })).toMatchSnapshot();
	});
	it("ts: false", () => {
		expect(
			createViteConfig({ ...defaultOptions, ts: false }),
		).toMatchSnapshot();
	});
});
