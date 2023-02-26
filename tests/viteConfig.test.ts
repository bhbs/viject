import { describe, expect, it } from "vitest";
import { Options } from "../src/options";
import { createViteConfig } from "../src/viteConfig";

const defaultOptions: Options = {
	ts: false,
	setupProxy: false,
};

describe("createViteConfig", () => {
	it("all: false", () => {
		const options = { ...defaultOptions };
		expect(createViteConfig(options)).toMatchSnapshot();
	});
	it("ts: true", () => {
		const options = { ...defaultOptions, ts: true };
		expect(createViteConfig(options)).toMatchSnapshot();
	});
	it("setupProxy: true", () => {
		const options = { ...defaultOptions, setupProxy: true };
		expect(createViteConfig(options)).toMatchSnapshot();
	});
});
