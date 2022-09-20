import { execSync } from "child_process";

export const checkGitStatus = () => {
	let gitStatus;

	try {
		let stdout = execSync("git status --porcelain", {
			stdio: ["pipe", "pipe", "ignore"],
		}).toString();
		gitStatus = stdout.trim();
	} catch (_) {}

	if (gitStatus) {
		console.error(
			`
        This git repository has untracked files or uncommitted changes:
        ${gitStatus
					.split("\n")
					.map((line) => line.match(/ .*/g)?.[0].trim())
					.join("\n")}
        Remove untracked files, stash or commit any changes, and try again.
      `,
		);
		process.exit(1);
	}
};
