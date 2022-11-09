import { EOL } from "os";
import { readFileSync, writeFileSync } from "fs";
import { appPackageJson, ownPackageJson } from "./paths.js";

export const overWritePackageJson = () => {
	const ownPackage = JSON.parse(readFileSync(ownPackageJson, "utf-8"));
	const appPackage = JSON.parse(readFileSync(appPackageJson, "utf-8"));

	if (appPackage.dependencies?.["react-scripts"]) {
		appPackage.dependencies["react-scripts"] = undefined;
	}

	if (appPackage.devDependencies?.["react-scripts"]) {
		appPackage.devDependencies["react-scripts"] = undefined;
	}

	if (!appPackage.devDependencies) {
		appPackage.devDependencies = {};
	}

	Object.keys(ownPackage.viteDependencies).forEach((key) => {
		appPackage.devDependencies[key] = ownPackage.viteDependencies[key];
	});

	Object.entries(appPackage.scripts)
		.filter(
			([_, script]) =>
				typeof script === "string" && script.includes("react-scripts"),
		)
		.forEach(([command, _]) => (appPackage.scripts[command] = undefined));

	appPackage.jest = undefined;

	appPackage.scripts = {
		...appPackage.scripts,
		dev: "vite",
		start: "vite",
		build: "vite build",
		test: "vitest",
	};

	writeFileSync(appPackageJson, JSON.stringify(appPackage, null, 2) + EOL);
};
