import { execSync } from "node:child_process";

export const checkGitStatus = () => {
	let gitStatus;

	try {
		const stdout = execSync("git status --porcelain", {
			stdio: ["pipe", "pipe", "ignore"],
		}).toString();
		gitStatus = stdout.trim();
	} catch (_) {}

	return gitStatus;
};
