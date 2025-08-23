import { readdirSync, readFileSync, renameSync } from "node:fs";
import { Parser } from "acorn";
import jsx from "acorn-jsx";

const parser = Parser.extend(jsx());

function isJsx(source: string) {
	try {
		const ast = parser.parse(source, {
			ecmaVersion: "latest",
			sourceType: "module",
		});
		return JSON.stringify(ast).includes("JSX");
	} catch (_) {
		return true;
	}
}

export const convertJS2JSX = () => {
	const files = readdirSyncRecursively("src").filter((file) =>
		/\.js$/.test(file),
	);
	for (const file of files) {
		const code = readFileSync(file, "utf-8");
		if (isJsx(code)) {
			renameSync(file, `${file}x`);
		}
	}
};

const readdirSyncRecursively = (directory: string): string[] => {
	const dirents = readdirSync(directory, { withFileTypes: true });
	return dirents.flatMap((dirent) => {
		const path = `${directory}/${dirent.name}`;
		if (dirent.isDirectory()) {
			return readdirSyncRecursively(path);
		}
		return [path];
	});
};
