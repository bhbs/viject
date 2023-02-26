import { existsSync, lstatSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import {
	appSetupProxy,
	appSetupTestsJs,
	appSetupTestsTs,
	appSrcDir,
	appTsConfig,
} from "./paths.js";

export type Options = {
	ts: boolean;
	svg: boolean;
	setupProxy: boolean;
	setupTestsJs: boolean;
	setupTestsTs: boolean;
};

export const getOptions = () => {
	const ts = existsSync(appTsConfig);
	const svg = searchSvg(appSrcDir);
	const setupProxy = existsSync(appSetupProxy);
	const setupTestsJs = existsSync(appSetupTestsJs);
	const setupTestsTs = existsSync(appSetupTestsTs);
	return {
		ts,
		svg,
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
