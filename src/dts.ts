import { existsSync, readFileSync, writeFileSync } from "fs";
import { EOL } from "os";
import { appTypeDeclarations, ownTypeDeclarations } from "./paths.js";

export const overWriteDTS = () => {
	if (existsSync(appTypeDeclarations)) {
		try {
			const appContent = readFileSync(appTypeDeclarations, "utf8").replace(
				/^\s*\/\/\/\s*<reference\s+types.+?"react-scripts".*\/>.*(?:\n|$)/gm,
				"",
			);
			const ownContent = readFileSync(ownTypeDeclarations, "utf8");
			writeFileSync(
				appTypeDeclarations,
				ownContent.trim() + EOL + appContent.trim() + EOL,
			);
		} catch (e) {
			console.error(e);
			// It's not essential that this succeeds, the TypeScript user should
			// be able to re-create these types with ease.
		}
	}
};
