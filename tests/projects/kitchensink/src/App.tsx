import React, { useMemo } from "react";
import { BaseUrl } from "./features/config/BaseUrl";
import { ExpandEnvVariables } from "./features/env/ExpandEnvVariables";
import { FileEnvVariables } from "./features/env/FileEnvVariables";
import { PublicUrl } from "./features/env/PublicUrl";
import { ShellEnvVariables } from "./features/env/ShellEnvVariables";
import { CssInclusion } from "./features/webpack/CssInclusion";
import { CssModulesInclusion } from "./features/webpack/CssModulesInclusion";
import { DynamicImport } from "./features/webpack/DynamicImport";
import { ImageInclusion } from "./features/webpack/ImageInclusion";
import { JsonInclusion } from "./features/webpack/JsonInclusion";
import { SassInclusion } from "./features/webpack/SassInclusion";
import { SassModulesInclusion } from "./features/webpack/SassModulesInclusion";
import { ScssInclusion } from "./features/webpack/ScssInclusion";
import { ScssModulesInclusion } from "./features/webpack/ScssModulesInclusion";
import { SvgComponent } from "./features/webpack/SvgComponent";
import { SvgInclusion } from "./features/webpack/SvgInclusion";
import { SvgInCss } from "./features/webpack/SvgInCss";

const App = () => {
	const Feature = useMemo(() => {
		const hash = window.location.hash;
		const feature = hash.slice(1);
		// removed:
		//   LinkedModules
		//   NoExtInclusion
		//   UnknownExtInclusion
		switch (feature) {
			case "css-inclusion":
				return <CssInclusion />;
			case "css-modules-inclusion":
				return <CssModulesInclusion />;
			case "scss-inclusion":
				return <ScssInclusion />;
			case "scss-modules-inclusion":
				return <ScssModulesInclusion />;
			case "sass-inclusion":
				return <SassInclusion />;
			case "sass-modules-inclusion":
				return <SassModulesInclusion />;
			case "file-env-variables":
				return <FileEnvVariables />;
			case "image-inclusion":
				return <ImageInclusion />;
			case "json-inclusion":
				return <JsonInclusion />;
			case "public-url":
				return <PublicUrl />;
			case "shell-env-variables":
				return <ShellEnvVariables />;
			case "svg-inclusion":
				return <SvgInclusion />;
			case "svg-component":
				return <SvgComponent />;
			case "svg-in-css":
				return <SvgInCss />;
			case "expand-env-variables":
				return <ExpandEnvVariables />;
			case "base-url":
				return <BaseUrl />;
			case "dynamic-import":
				return <DynamicImport />;
			default:
				return null;
		}
	}, []);

	return Feature;
};

export default App;
