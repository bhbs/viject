import { existsSync, copyFileSync } from "node:fs";
import {
	appViteCpnfig,
	ownViteCpnfig,
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

if (!existsSync(appViteCpnfig)) {
	copyFileSync(ownViteCpnfig, appViteCpnfig);
}

if (!existsSync(appIndexHTML)) {
	copyFileSync(ownIndexHTML, appIndexHTML);
}

convertJS2JSX();
