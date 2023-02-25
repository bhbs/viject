import { existsSync } from "node:fs";
import { appTsConfig } from "./paths.js";

export type Options = {
	ts: boolean;
};

export const getOptions = () => {
	const ts = existsSync(appTsConfig);
	return {
		ts,
	} satisfies Options;
};
