import React from "react";

export const FileEnvVariables = () => (
	<ul id="feature-file-env-variables">
		<li id="feature-file-env-original-1">{process.env.REACT_APP_ORIGINAL_1}</li>
		<li id="feature-file-env-original-2">{process.env.REACT_APP_ORIGINAL_2}</li>
		<li id="feature-file-env">
			{process.env.REACT_APP_DEVELOPMENT}
			{process.env.REACT_APP_PRODUCTION}
		</li>
		<li id="feature-file-env-x">{process.env.REACT_APP_X}</li>
	</ul>
);
