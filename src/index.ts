import { existsSync, copyFileSync, readFileSync } from "node:fs";
import { intro, outro, spinner, cancel } from "@clack/prompts";
import {
	appViteConfig,
	ownViteConfig,
	appIndexHTML,
	oldIndexHTML,
} from "./paths.js";
import { convertJS2JSX } from "./convert.js";
import { checkGitStatus } from "./git.js";
import { overWritePackageJson } from "./packageJson.js";
import { overWriteDTS } from "./dts.js";
import { moveIndexHTML } from "./html.js";

intro("Start migrating...");

const checkGitStatusStep = spinner();
checkGitStatusStep.start("Checking Git status");
const gitStatus = checkGitStatus();
if (gitStatus) {
	cancel("Aborted");
	console.info(
		"This git repository has untracked files or uncommitted changes:",
	);
	console.info(gitStatus);
	console.info(
		"Remove untracked files, stash or commit any changes, and try again.",
	);
	process.exit(0);
}
checkGitStatusStep.stop("Checking Git status: Done");

const overWritePackageJsonStep = spinner();
overWritePackageJsonStep.start("Rewriting package.json");
overWritePackageJson();
overWritePackageJsonStep.stop("Rewriting package.json: Done");

const overWriteDTSStep = spinner();
overWriteDTSStep.start("Rewriting d.ts files");
overWriteDTS();
overWriteDTSStep.stop("Rewriting d.ts files: Done");

if (!existsSync(appViteConfig)) {
	const copyViteConfigStep = spinner();
	copyViteConfigStep.start("Copying vite.config.js");
	copyFileSync(ownViteConfig, appViteConfig);
	copyViteConfigStep.stop("Copying vite.config.js: Done");
}

if (existsSync(oldIndexHTML) && !existsSync(appIndexHTML)) {
	const moveIndexHTMLStep = spinner();
	moveIndexHTMLStep.start("Moving index.html");
	moveIndexHTML();
	moveIndexHTMLStep.stop("Moving index.html: Done");
}

const convertJS2JSXStep = spinner();
convertJS2JSXStep.start("Converting JS to JSX");
convertJS2JSX();
convertJS2JSXStep.stop("Converting JS to JSX: Done");

outro("Done ⚡");
