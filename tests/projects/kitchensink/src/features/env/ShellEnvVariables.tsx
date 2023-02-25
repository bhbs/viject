import React from "react";

export const ShellEnvVariables = () => (
	<span id="feature-shell-env-variables">
		{process.env.REACT_APP_SHELL_ENV_MESSAGE}.
	</span>
);
