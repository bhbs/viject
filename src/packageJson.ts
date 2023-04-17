import { EOL } from "node:os";
import { readFileSync, writeFileSync } from "node:fs";
import { appPackageJson, ownPackageJson } from "./paths.js";
import { Options } from "./options.js";

export const overWritePackageJson = (options: Options) => {
	const ownPackage = JSON.parse(readFileSync(ownPackageJson, "utf-8"));
	const appPackage = JSON.parse(readFileSync(appPackageJson, "utf-8"));

	if (!appPackage.devDependencies) {
		appPackage.devDependencies = {};
	}

	const viteDeps = [
		"@vitejs/plugin-react",
		"vite",
		...(options.svg ? ["vite-plugin-svgr"] : []),
		...(options.tsConfig || options.jsConfig ? ["vite-tsconfig-paths"] : []),
	];

	Object.keys(ownPackage.devDependencies).forEach((key) => {
		if (viteDeps.includes(key)) {
			appPackage.devDependencies[key] = ownPackage.devDependencies[key];
		}
	});

	appPackage.scripts = {
		...appPackage.scripts,
		dev: "vite",
		start: appPackage.scripts["start"]?.includes("react-scripts start")
			? appPackage.scripts["start"].replace("react-scripts start", "vite")
			: "vite",
		build: appPackage.scripts["build"]?.includes("react-scripts build")
			? appPackage.scripts["build"].replace("react-scripts build", "vite build")
			: "vite build",
	};

	writeFileSync(appPackageJson, JSON.stringify(appPackage, null, 2) + EOL);
};
