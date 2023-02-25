import React from "react";

export const FileEnvVariables = () => (
	<span id="feature-file-env-variables">
		<span id="feature-file-env-original-1">
			{process.env.REACT_APP_ORIGINAL_1}
		</span>
		<span id="feature-file-env-original-2">
			{process.env.REACT_APP_ORIGINAL_2}
		</span>
		<span id="feature-file-env">
			{process.env.REACT_APP_DEVELOPMENT}
			{process.env.REACT_APP_PRODUCTION}
		</span>
		<span id="feature-file-env-x">{process.env.REACT_APP_X}</span>
	</span>
);
