import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import {
	appJsConfig,
	appPackageJson,
	appSetupProxy,
	appSetupTestsJs,
	appSetupTestsTs,
	appSrcDir,
	appTsConfig,
} from "./paths.js";

export type Options = {
	jsConfig: boolean;
	tsConfig: boolean;
	svg: boolean;
	proxy: boolean;
	setupProxy: boolean;
	setupTestsJs: boolean;
	setupTestsTs: boolean;
};

export const getOptions = () => {
	const jsConfig = existsSync(appJsConfig);
	const tsConfig = existsSync(appTsConfig);
	const svg = searchSvg(appSrcDir);
	const proxy = JSON.parse(readFileSync(appPackageJson, "utf-8")).proxy;
	const setupProxy = existsSync(appSetupProxy);
	const setupTestsJs = existsSync(appSetupTestsJs);
	const setupTestsTs = existsSync(appSetupTestsTs);
	return {
		jsConfig,
		tsConfig,
		svg,
		proxy,
		setupProxy,
		setupTestsJs,
		setupTestsTs,
	} satisfies Options;
};

function searchSvg(dir: string): boolean {
	for (const file of readdirSync(dir)) {
		const path = resolve(dir, file);
		if (lstatSync(path).isDirectory() && searchSvg(path)) return true;
		if (path.endsWith(".svg")) return true;
	}
	return false;
}
