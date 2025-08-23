import { useMemo, useState } from "react";
import { BaseUrl } from "./features/config/BaseUrl";
import { ProxyMiddleware } from "./features/config/ProxyMiddleware";
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
import { SvgInCss } from "./features/webpack/SvgInCss";
import { SvgInclusion } from "./features/webpack/SvgInclusion";

// removed:
//   LinkedModules
//   NoExtInclusion
//   UnknownExtInclusion
const features = {
	"css-inclusion": <CssInclusion />,
	"css-modules-inclusion": <CssModulesInclusion />,
	"scss-inclusion": <ScssInclusion />,
	"scss-modules-inclusion": <ScssModulesInclusion />,
	"sass-inclusion": <SassInclusion />,
	"sass-modules-inclusion": <SassModulesInclusion />,
	"file-env-variables": <FileEnvVariables />,
	"image-inclusion": <ImageInclusion />,
	"json-inclusion": <JsonInclusion />,
	"public-url": <PublicUrl />,
	"shell-env-variables": <ShellEnvVariables />,
	"svg-inclusion": <SvgInclusion />,
	"svg-component": <SvgComponent />,
	"svg-in-css": <SvgInCss />,
	"expand-env-variables": <ExpandEnvVariables />,
	"base-url": <BaseUrl />,
	"proxy-middleware": <ProxyMiddleware />,
	"dynamic-import": <DynamicImport />,
};

const App = () => {
	const hash = window.location.hash;
	const feature = hash.slice(1) as keyof typeof features;
	const [featureState, setFeatureState] = useState(feature);

	const Links = useMemo(() => {
		return (
			<ul>
				{Object.entries(features).map(([feature]) => (
					<li key={feature}>
						{/* rome-ignore lint/a11y/useValidAnchor: <explanation> */}
						<a
							href={`#${feature}`}
							onClick={() => setFeatureState(feature as keyof typeof features)}
						>
							{feature}
						</a>
					</li>
				))}
			</ul>
		);
	}, []);

	const Feature = useMemo(() => {
		return features[featureState] || null;
	}, [featureState]);

	return (
		<main>
			{Links}
			{Feature}
		</main>
	);
};

export default App;
