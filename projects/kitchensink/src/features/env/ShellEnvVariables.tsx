import React from "react";

export const ShellEnvVariables = () => (
	<p id="feature-shell-env-variables">
		{process.env.REACT_APP_SHELL_ENV_MESSAGE}
	</p>
);
