import { readFileSync, writeFileSync } from "node:fs";
import { appIndexHTML, oldIndexHTML } from "./paths.js";

export const moveIndexHTML = () => {
	try {
		const html = readFileSync(oldIndexHTML, "utf-8").replace(
			/<\/head>/,
			'<script type="module" src="src/index"></script></head>',
		);
		writeFileSync(appIndexHTML, html);
	} catch (e) {
		console.error(e);
	}
};
