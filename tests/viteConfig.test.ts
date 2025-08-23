import { describe, expect, it } from "vitest";
import type { Options } from "../src/options";
import { createViteConfig } from "../src/viteConfig";

const defaultOptions: Options = {
	tsConfig: false,
	jsConfig: false,
	svg: false,
	proxy: false,
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
	it("proxy: true", () => {
		const options = { ...defaultOptions, proxy: true };
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
