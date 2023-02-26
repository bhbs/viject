import { existsSync } from "node:fs";
import { appSetupProxy, appTsConfig } from "./paths.js";

export type Options = {
	ts: boolean;
	setupProxy: boolean;
};

export const getOptions = () => {
	const ts = existsSync(appTsConfig);
	const setupProxy = existsSync(appSetupProxy);
	return {
		ts,
		setupProxy,
	} satisfies Options;
};
