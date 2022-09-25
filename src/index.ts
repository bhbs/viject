import { existsSync, copyFileSync } from "node:fs";
import {
	appViteConfig,
	ownViteConfig,
	appIndexHTML,
	ownIndexHTML,
} from "./paths.js";
import { convertJS2JSX } from "./convert.js";
import { checkGitStatus } from "./git.js";
import { overWritePackageJson } from "./packageJson.js";
import { overWriteDTS } from "./dts.js";

checkGitStatus();
overWritePackageJson();
overWriteDTS();

if (!existsSync(appViteConfig)) {
	copyFileSync(ownViteConfig, appViteConfig);
}

if (!existsSync(appIndexHTML)) {
	copyFileSync(ownIndexHTML, appIndexHTML);
}

convertJS2JSX();
