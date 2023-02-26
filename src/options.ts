import { existsSync } from "node:fs";
import {
	appSetupProxy,
	appSetupTestsJs,
	appSetupTestsTs,
	appTsConfig,
} from "./paths.js";

export type Options = {
	ts: boolean;
	setupProxy: boolean;
	setupTestsJs: boolean;
	setupTestsTs: boolean;
};

export const getOptions = () => {
	const ts = existsSync(appTsConfig);
	const setupProxy = existsSync(appSetupProxy);
	const setupTestsJs = existsSync(appSetupTestsJs);
	const setupTestsTs = existsSync(appSetupTestsTs);
	return {
		ts,
		setupProxy,
		setupTestsJs,
		setupTestsTs,
	} satisfies Options;
};
