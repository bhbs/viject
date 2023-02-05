import React from "react";

export const ExpandEnvVariables = () => (
	<span>
		<span id="feature-expand-env-1">{process.env.REACT_APP_BASIC}</span>
		<span id="feature-expand-env-2">{process.env.REACT_APP_BASIC_EXPAND}</span>
		<span id="feature-expand-env-3">
			{process.env.REACT_APP_BASIC_EXPAND_SIMPLE}
		</span>
		<span id="feature-expand-env-existing">
			{process.env.REACT_APP_EXPAND_EXISTING}
		</span>
	</span>
);
