export const ExpandEnvVariables = () => (
	<ul id="feature-expand-env-variables">
		<li id="feature-expand-env-1">{process.env.REACT_APP_BASIC}</li>
		<li id="feature-expand-env-2">{process.env.REACT_APP_BASIC_EXPAND}</li>
		<li id="feature-expand-env-3">
			{process.env.REACT_APP_BASIC_EXPAND_SIMPLE}
		</li>
		<li id="feature-expand-env-existing">
			{process.env.REACT_APP_EXPAND_EXISTING}
		</li>
	</ul>
);
