import { describe, expect, it } from "vitest";
import { Options } from "../src/options";
import { createViteConfig } from "../src/viteConfig";

const defaultOptions: Options = {
	tsConfig: false,
	jsConfig: false,
	svg: false,
	setupProxy: false,
	setupTestsJs: false,
	setupTestsTs: false,
};

describe("createViteConfig", () => {
	it("all: false", () => {
		const options = { ...defaultOptions };
		expect(createViteConfig(options)).toMatchSnapshot();
	});
	it("tsConfig: true", () => {
		const options = { ...defaultOptions, tsConfig: true };
		expect(createViteConfig(options)).toMatchSnapshot();
	});
	it("jsConfig: true", () => {
		const options = { ...defaultOptions, jsConfig: true };
		expect(createViteConfig(options)).toMatchSnapshot();
	});
	it("svg: true", () => {
		const options = { ...defaultOptions, svg: true };
		expect(createViteConfig(options)).toMatchSnapshot();
	});
	it("setupProxy: true", () => {
		const options = { ...defaultOptions, setupProxy: true };
		expect(createViteConfig(options)).toMatchSnapshot();
	});
	it("setupTestsJs: true", () => {
		const options = { ...defaultOptions, setupTestsJs: true };
		expect(createViteConfig(options)).toMatchSnapshot();
	});
	it("setupTestsTs: true", () => {
		const options = { ...defaultOptions, setupTestsTs: true };
		expect(createViteConfig(options)).toMatchSnapshot();
	});
});
