import { existsSync } from "node:fs";
import { cancel, intro, note, outro, spinner } from "@clack/prompts";
import { convertJS2JSX } from "./convert.js";
import { overWriteDTS } from "./dts.js";
import { checkGitStatus } from "./git.js";
import { moveIndexHTML } from "./html.js";
import { getOptions } from "./options.js";
import { overWritePackageJson } from "./packageJson.js";
import {
	appIndexHTML,
	appViteConfigJs,
	appViteConfigTs,
	oldIndexHTML,
} from "./paths.js";
import { writeViteConfig } from "./viteConfig.js";

const options = getOptions();

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
overWritePackageJson(options);
overWritePackageJsonStep.stop("Rewriting package.json: Done");

const overWriteDTSStep = spinner();
overWriteDTSStep.start("Rewriting d.ts files");
overWriteDTS();
overWriteDTSStep.stop("Rewriting d.ts files: Done");

if (!existsSync(appViteConfigTs) && !existsSync(appViteConfigJs)) {
	const writeViteConfigStep = spinner();
	writeViteConfigStep.start("Writing vite.config.js");
	writeViteConfig(options);
	writeViteConfigStep.stop("Writing vite.config.js: Done");
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

const nextSteps = `\
// npm
npm install
npm run dev
// yarn
yarn install
yarn dev
// pnpm
pnpm install
pnpm dev`;

note(nextSteps, "Next steps");

outro("Done ⚡");
